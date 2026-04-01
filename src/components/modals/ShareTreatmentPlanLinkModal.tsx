// Share patient-facing treatment plan link (SMS) — item checkboxes + compose step

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Client, DiscussedItem } from "../../types";
import { useDashboard } from "../../context/DashboardContext";
import { sendSMSNotification } from "../../services/api";
import {
  getPostVisitBlueprintBookingUrl,
  isPostVisitBlueprintSender,
} from "../../utils/providerHelpers";
import { showError, showToast } from "../../utils/toast";
import {
  cleanPhoneNumber,
  formatPhoneDisplay,
  isValidPhone,
} from "../../utils/validation";
import {
  createAndStorePostVisitBlueprint,
  defaultIncludeItemInSharedTreatmentPlanLink,
  filterDiscussedItemsForPostVisitBlueprint,
  trackPostVisitBlueprintEvent,
  warmPostVisitBlueprintForSend,
} from "../../utils/postVisitBlueprint";
import { formatPrice } from "../../data/treatmentPricing2025";
import { patientFacingSkincareShortName } from "../../utils/pvbSkincareDisplay";
import { getTreatmentDisplayName } from "./DiscussedTreatmentsModal/utils";
import {
  computeQuoteSheetDataForDiscussedItems,
  getAlignedCheckoutLineItemsForDiscussedItems,
} from "./DiscussedTreatmentsModal/TreatmentPlanCheckout";
import "./TreatmentPlanCheckoutModal.css";
import "./ShareTreatmentPlanLinkModal.css";

export interface ShareTreatmentPlanLinkModalProps {
  client: Client;
  discussedItems: DiscussedItem[];
  onClose: () => void;
  onSuccess?: () => void;
  recommenderFocusRegions?: string[];
}

function sectionLabelForShareRow(item: DiscussedItem): string {
  if ((item.treatment ?? "").trim() === "Skincare") return "Skincare";
  const t = (item.timeline ?? "").trim();
  if (t === "Add next visit") return "Add next visit";
  if (t === "Wishlist" || !t) return "Wishlist";
  return t;
}

/** Per-line amount in the quote preview: prefer formatted string from checkout (ranges, per-unit math, "Price varies"). */
function shareRowPriceDisplay(
  line:
    | { price?: number; displayPrice?: string }
    | undefined,
): string {
  if (line?.displayPrice?.trim()) return line.displayPrice.trim();
  return formatPrice(line?.price ?? 0);
}

function shareRowPrimaryLabel(
  item: DiscussedItem,
  line: { skuName?: string; label: string; quoteLineKind?: "skincare" | "treatment" } | undefined,
): string {
  if (!line) return getTreatmentDisplayName(item);
  const raw = (line.skuName ?? line.label ?? "").trim();
  if (line.quoteLineKind === "skincare" && raw) {
    return patientFacingSkincareShortName(raw);
  }
  if (raw) return raw;
  return getTreatmentDisplayName(item);
}

export default function ShareTreatmentPlanLinkModal({
  client,
  discussedItems,
  onClose,
  onSuccess,
  recommenderFocusRegions,
}: ShareTreatmentPlanLinkModalProps) {
  const { provider } = useDashboard();
  const firstName = client.name?.trim().split(/\s+/)[0] || "Patient";
  const clinicName = useMemo(() => {
    const raw = (provider?.name ?? "").trim();
    if (!raw) return "your clinic";
    return raw.split(",")[0]?.trim() || raw;
  }, [provider?.name]);

  const providerPhone = useMemo(() => {
    const candidate = [
      provider?.["Phone Number"],
      provider?.["Phone"],
      provider?.phone,
      provider?.["Office Phone"],
      provider?.["Text Phone"],
    ].find((value) => String(value ?? "").trim());
    const cleaned = cleanPhoneNumber(
      typeof candidate === "number" || typeof candidate === "string"
        ? candidate
        : null,
    );
    return cleaned || undefined;
  }, [provider]);

  const financingUrl = useMemo(() => {
    const val = String(
      provider?.["Financing Link"] ??
        provider?.["Financing URL"] ??
        provider?.["CareCredit Link"] ??
        provider?.["Cherry Link"] ??
        "",
    ).trim();
    return val || "https://www.carecredit.com";
  }, [provider]);

  const eligibleItems = useMemo(
    () => filterDiscussedItemsForPostVisitBlueprint(discussedItems),
    [discussedItems],
  );

  const discussedIndexByItemId = useMemo(() => {
    const m = new Map<string, number>();
    discussedItems.forEach((d, i) => m.set(d.id, i));
    return m;
  }, [discussedItems]);

  const checkoutLinesByDiscussedIndex = useMemo(
    () => getAlignedCheckoutLineItemsForDiscussedItems(discussedItems),
    [discussedItems],
  );

  const { skincareShareItems, treatmentShareItems } = useMemo(() => {
    const skincare: DiscussedItem[] = [];
    const treatment: DiscussedItem[] = [];
    for (const item of eligibleItems) {
      const idx = discussedIndexByItemId.get(item.id);
      const line =
        idx !== undefined ? checkoutLinesByDiscussedIndex[idx] : undefined;
      if (line?.quoteLineKind === "skincare") skincare.push(item);
      else treatment.push(item);
    }
    return {
      skincareShareItems: skincare,
      treatmentShareItems: treatment,
    };
  }, [eligibleItems, discussedIndexByItemId, checkoutLinesByDiscussedIndex]);

  const lineForItem = useCallback(
    (item: DiscussedItem) => {
      const idx = discussedIndexByItemId.get(item.id);
      if (idx === undefined) return undefined;
      return checkoutLinesByDiscussedIndex[idx];
    },
    [discussedIndexByItemId, checkoutLinesByDiscussedIndex],
  );

  const eligibleIdsKey = useMemo(
    () => [...eligibleItems.map((i) => i.id)].sort().join(","),
    [eligibleItems],
  );

  const [inclusionById, setInclusionById] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const item of eligibleItems) {
      next[item.id] = defaultIncludeItemInSharedTreatmentPlanLink(item);
    }
    setInclusionById(next);
  }, [eligibleIdsKey, eligibleItems]);

  const includedSkincareSubtotal = useMemo(() => {
    return skincareShareItems.reduce((sum, item) => {
      if (!inclusionById[item.id]) return sum;
      return sum + (lineForItem(item)?.price ?? 0);
    }, 0);
  }, [skincareShareItems, inclusionById, lineForItem]);

  const includedTreatmentSubtotal = useMemo(() => {
    return treatmentShareItems.reduce((sum, item) => {
      if (!inclusionById[item.id]) return sum;
      return sum + (lineForItem(item)?.price ?? 0);
    }, 0);
  }, [treatmentShareItems, inclusionById, lineForItem]);

  const includedSelectionTotal =
    includedSkincareSubtotal + includedTreatmentSubtotal;

  const [step, setStep] = useState<"pick" | "send">("pick");
  const [preparingLink, setPreparingLink] = useState(false);
  const [sending, setSending] = useState(false);
  const [blueprintMessageDraft, setBlueprintMessageDraft] = useState("");
  const [blueprintRecipientPhone, setBlueprintRecipientPhone] = useState("");
  const [pendingBlueprintLink, setPendingBlueprintLink] = useState<
    string | null
  >(null);
  const [pendingBlueprintToken, setPendingBlueprintToken] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isPostVisitBlueprintSender(provider)) return;
    warmPostVisitBlueprintForSend(client, discussedItems);
  }, [client, discussedItems, provider]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preparingLink && !sending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, preparingLink, sending]);

  const toggleInclude = useCallback((id: string) => {
    setInclusionById((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const includedIdSet = useMemo(() => {
    const s = new Set<string>();
    Object.entries(inclusionById).forEach(([id, on]) => {
      if (on) s.add(id);
    });
    return s;
  }, [inclusionById]);

  const handlePrepareLink = useCallback(async () => {
    if (!isPostVisitBlueprintSender(provider)) {
      showError(
        "Sharing the treatment plan link is only available for authorized providers.",
      );
      return;
    }
    if (!client) {
      showError("Missing patient context.");
      return;
    }
    if (includedIdSet.size === 0) {
      showError("Select at least one item to include on the shared plan.");
      return;
    }
    const quoteData = computeQuoteSheetDataForDiscussedItems(discussedItems);
    if (!quoteData) {
      showError("Could not build pricing context for this plan.");
      return;
    }
    const formattedPhone = formatPhoneDisplay(client.phone);
    if (!isValidPhone(formattedPhone)) {
      showError("A valid patient phone number is required.");
      return;
    }

    setPreparingLink(true);
    try {
      const totalAfterDiscount = quoteData.total;
      const { token, link } = await createAndStorePostVisitBlueprint({
        clinicName,
        providerName: (provider?.name ?? "").trim() || "Your provider",
        providerCode: provider?.code,
        providerPhone,
        client,
        discussedItems,
        includedDiscussedItemIds: includedIdSet,
        recommenderFocusRegions:
          recommenderFocusRegions && recommenderFocusRegions.length > 0
            ? [...recommenderFocusRegions]
            : undefined,
        quote: {
          lineItems: quoteData.lineItems,
          total: quoteData.total,
          totalAfterDiscount,
          hasUnknownPrices: quoteData.hasUnknownPrices,
          isMintMember: false,
        },
        cta: {
          bookingUrl: getPostVisitBlueprintBookingUrl(provider),
          financingUrl,
          textProviderPhone: providerPhone,
        },
      });
      setPendingBlueprintLink(link);
      setPendingBlueprintToken(token);
      setBlueprintRecipientPhone(formattedPhone || "");
      setBlueprintMessageDraft(
        `Hi ${firstName}, your custom treatment plan from ${clinicName} is ready. Review it here: ${link}`,
      );
      setStep("send");
    } catch (e) {
      showError(
        e instanceof Error ? e.message : "Failed to prepare treatment plan link.",
      );
    } finally {
      setPreparingLink(false);
    }
  }, [
    client,
    clinicName,
    discussedItems,
    financingUrl,
    firstName,
    includedIdSet,
    provider,
    providerPhone,
    recommenderFocusRegions,
  ]);

  const handleConfirmSend = useCallback(async () => {
    if (!client || !pendingBlueprintLink || !pendingBlueprintToken) {
      showError("Link is missing. Go back and try again.");
      return;
    }
    if (!blueprintMessageDraft.trim()) {
      showError("Please enter a message before sending.");
      return;
    }
    if (!isValidPhone(formatPhoneDisplay(blueprintRecipientPhone))) {
      showError("Enter a valid recipient phone number.");
      return;
    }

    setSending(true);
    try {
      await sendSMSNotification(
        cleanPhoneNumber(blueprintRecipientPhone),
        blueprintMessageDraft.trim(),
        client.name,
      );
      trackPostVisitBlueprintEvent("blueprint_delivered", {
        token: pendingBlueprintToken,
        clinic_name: clinicName,
        provider_name: provider?.name ?? "",
        patient_id: client.id,
      });
      showToast(`Treatment plan link sent to ${firstName}`);
      onSuccess?.();
      onClose();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Failed to send SMS.");
    } finally {
      setSending(false);
    }
  }, [
    blueprintMessageDraft,
    blueprintRecipientPhone,
    client,
    clinicName,
    firstName,
    onClose,
    onSuccess,
    pendingBlueprintLink,
    pendingBlueprintToken,
    provider?.name,
  ]);

  const handlePreviewLink = useCallback(() => {
    if (!pendingBlueprintLink) {
      showError("Link is not ready yet.");
      return;
    }
    window.open(pendingBlueprintLink, "_blank", "noopener,noreferrer");
  }, [pendingBlueprintLink]);

  if (!isPostVisitBlueprintSender(provider)) {
    return (
      <div
        className="share-treatment-plan-link-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-treatment-plan-link-title"
      >
        <div
          className="share-treatment-plan-link-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="share-treatment-plan-link-title">Share treatment plan</h2>
          <p>Your account cannot send the patient treatment plan link.</p>
          <button type="button" className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="treatment-plan-checkout-blueprint-compose-overlay share-treatment-plan-link-overlay"
      onClick={() => !preparingLink && !sending && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-treatment-plan-link-title"
    >
      <div
        className="treatment-plan-checkout-blueprint-compose-modal share-treatment-plan-link-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="share-treatment-plan-link-title"
          className="share-tp-link-dialog-title"
        >
          Share treatment plan
        </h3>
        {step === "pick" ? (
          <>
            <p className="share-tp-link-dialog-subtitle">
              Choose items for the patient link—pricing matches their plan.
              Now, next visit &amp; Skincare default on; Wishlist off.
            </p>
            <div className="share-tp-link-dialog-body">
            {eligibleItems.length === 0 ? (
              <p className="share-treatment-plan-link-empty">
                Only Now, Add next visit, Wishlist, and Skincare can be shared.
                Move items out of Completed, or add plan rows in those
                sections.
              </p>
            ) : (
              <div className="share-tp-link-quote">
                {skincareShareItems.length > 0 ? (
                  <div className="share-tp-link-quote-section">
                    <h4 className="share-tp-link-quote-section-title">
                      Skincare products
                    </h4>
                    <ul className="share-tp-link-quote-rows">
                      {skincareShareItems.map((item) => {
                        const line = lineForItem(item);
                        return (
                          <li key={item.id}>
                            <label className="share-tp-link-quote-row">
                              <input
                                type="checkbox"
                                checked={Boolean(inclusionById[item.id])}
                                onChange={() => toggleInclude(item.id)}
                              />
                              <span className="share-tp-link-quote-row-text">
                                <span className="share-treatment-plan-link-row-title">
                                  {shareRowPrimaryLabel(item, line)}
                                </span>
                                <span className="share-treatment-plan-link-row-meta">
                                  {sectionLabelForShareRow(item)}
                                </span>
                              </span>
                              <strong className="share-tp-link-quote-row-price">
                                {shareRowPriceDisplay(line)}
                              </strong>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="share-tp-link-quote-subtotal">
                      <span>Skincare subtotal</span>
                      <strong>{formatPrice(includedSkincareSubtotal)}</strong>
                    </div>
                  </div>
                ) : null}
                {treatmentShareItems.length > 0 ? (
                  <div className="share-tp-link-quote-section">
                    <h4 className="share-tp-link-quote-section-title">
                      Treatments
                    </h4>
                    <ul className="share-tp-link-quote-rows">
                      {treatmentShareItems.map((item) => {
                        const line = lineForItem(item);
                        return (
                          <li key={item.id}>
                            <label className="share-tp-link-quote-row">
                              <input
                                type="checkbox"
                                checked={Boolean(inclusionById[item.id])}
                                onChange={() => toggleInclude(item.id)}
                              />
                              <span className="share-tp-link-quote-row-text">
                                <span className="share-treatment-plan-link-row-title">
                                  {shareRowPrimaryLabel(item, line)}
                                </span>
                                <span className="share-treatment-plan-link-row-meta">
                                  {sectionLabelForShareRow(item)}
                                </span>
                              </span>
                              <strong className="share-tp-link-quote-row-price">
                                {shareRowPriceDisplay(line)}
                              </strong>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="share-tp-link-quote-subtotal">
                      <span>Treatments subtotal</span>
                      <strong>{formatPrice(includedTreatmentSubtotal)}</strong>
                    </div>
                  </div>
                ) : null}
                <div className="share-tp-link-quote-footer">
                  <div className="share-tp-link-quote-total">
                    <span>Total</span>
                    <strong>{formatPrice(includedSelectionTotal)}</strong>
                  </div>
                </div>
              </div>
            )}
            </div>
            <div className="share-tp-link-dialog-footer">
              <div className="treatment-plan-checkout-blueprint-compose-actions share-treatment-plan-link-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={preparingLink}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePrepareLink}
                  disabled={
                    preparingLink ||
                    eligibleItems.length === 0 ||
                    includedIdSet.size === 0
                  }
                >
                  {preparingLink ? "Preparing…" : "Continue to SMS"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="share-tp-link-dialog-body">
            <label
              className="treatment-plan-checkout-blueprint-compose-label"
              htmlFor="share-tp-link-recipient-phone"
            >
              Recipient phone
            </label>
            <input
              id="share-tp-link-recipient-phone"
              type="tel"
              autoComplete="tel"
              className="treatment-plan-checkout-blueprint-compose-phone"
              placeholder="(555) 555-5555"
              value={blueprintRecipientPhone}
              onChange={(e) => setBlueprintRecipientPhone(e.target.value)}
            />
            <label
              className="treatment-plan-checkout-blueprint-compose-label treatment-plan-checkout-blueprint-compose-label--textarea"
              htmlFor="share-tp-link-message"
            >
              Message
            </label>
            <textarea
              id="share-tp-link-message"
              className="treatment-plan-checkout-blueprint-compose-textarea"
              value={blueprintMessageDraft}
              onChange={(e) => setBlueprintMessageDraft(e.target.value)}
              rows={6}
            />
            </div>
            <div className="share-tp-link-dialog-footer">
              <div className="treatment-plan-checkout-blueprint-compose-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setStep("pick");
                    setPendingBlueprintLink(null);
                    setPendingBlueprintToken(null);
                  }}
                  disabled={sending}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePreviewLink}
                  disabled={sending || !pendingBlueprintLink}
                >
                  Preview link
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmSend}
                  disabled={
                    sending ||
                    !blueprintMessageDraft.trim() ||
                    !isValidPhone(formatPhoneDisplay(blueprintRecipientPhone))
                  }
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
