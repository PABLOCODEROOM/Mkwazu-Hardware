export const APP_NAME = 'Mkwazu Hardware';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Inasubiri',
  confirmed: 'Imethibitishwa',
  processing: 'Inatengenezwa',
  shipped: 'Imetumwa',
  delivered: 'Imefika',
  cancelled: 'Imesitishwa',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Haijalipwa',
  paid: 'Imelipwa',
  failed: 'Imeshindwa',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash_on_delivery: 'Malipo Baada ya Utoaji',
  mobile_money: 'Pesa Taslimu (M-Pesa/Tigo Pesa)',
  bank_transfer: 'Uhamishaji Benki',
};

export const REGIONS = [
  'Dar es Salaam',
  'Mwanza',
  'Arusha',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Moshi',
  'Tabora',
  'Zanzibar',
  'Pemba',
  'Kilimanjaro',
  'Iringa',
  'Mtwara',
  'Ruvuma',
  'Kigoma',
  'Shinyanga',
  'Singida',
  'Rukwa',
  'Kagera',
  'Lindi',
  'Geita',
  'Katavi',
  'Njombe',
  'Simiyu',
];

export const DEFAULT_DELIVERY_FEE = 5000; // TZS 5,000
