import { services } from '../content/services';
export const statuses = ['new', 'reviewing', 'awaiting-details', 'quoted', 'closed'] as const;
export const fieldLimits: Record<string, number> = {
  Name: 180, Company: 180, Email: 254, Phone: 80, Origin: 180, Destination: 180,
  'Service required': 80, 'Cargo / commodity': 500, 'Number of packages': 12,
  'Total weight': 180, Dimensions: 180, 'Cargo ready date': 10,
  'Special handling requirements': 1500, 'Additional information': 2500,
};
export function validateEnquiry(input: Record<string, unknown>) {
  const data: Record<string, string> = {};
  for (const [key, limit] of Object.entries(fieldLimits)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error(`Please check ${key.toLowerCase()}.`);
    data[key] = value.trim();
  }
  for (const key of ['Name', 'Email', 'Origin', 'Destination', 'Service required', 'Cargo / commodity']) if (!data[key]) throw new Error(`${key} is required.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) throw new Error('Please enter a valid email address.');
  if (![...services.map(s => s.id), 'partner-enquiry', 'advice'].includes(data['Service required'])) throw new Error('Please select a service.');
  if (data['Number of packages'] && !/^[1-9]\d{0,8}$/.test(data['Number of packages'])) throw new Error('Enter a positive whole number of packages.');
  const date = data['Cargo ready date'];
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) throw new Error('Please check the cargo ready date.');
  return data;
}
