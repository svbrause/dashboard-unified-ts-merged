// Provider helper functions

import { Provider } from '../types';

export function getJotformUrl(provider: Provider | null): string {
  if (!provider) return 'https://app.ponce.ai/face/default-clinic';
  
  const formLink = provider['Form Link'] || provider.FormLink || provider['Form link'] || provider['form link'];
  if (formLink) return formLink;
  
  return provider.JotformURL || provider.SCAN_FORM_URL || 'https://app.ponce.ai/face/default-clinic';
}

export function getTelehealthLink(provider: Provider | null): string {
  if (!provider) return 'https://your-telehealth-link.com';
  return provider['Web Link'] || provider.WebLink || 'https://your-telehealth-link.com';
}

export function getTelehealthScanLink(provider: Provider | null): string {
  if (!provider) {
    console.warn('⚠️ PROVIDER_INFO not loaded yet, using default URL');
    return 'https://app.ponce.ai/face/default-email';
  }
  
  let link = provider['Web Link'] || 
             provider.WebLink ||
             provider['web link'] ||
             provider.webLink;
  
  if (!link) {
    link = provider['Form Link'] || 
           provider.FormLink ||
           provider['Form link'] ||
           provider.formLink;
  }
  
  if (!link) {
    console.warn('⚠️ No Web Link or Form Link found in provider info, using default');
    return 'https://app.ponce.ai/face/default-email';
  }
  
  return link;
}
