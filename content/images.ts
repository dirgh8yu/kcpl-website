// Illustrative stock, never evidence of KCPL ownership or a named KCPL project.
// Centralized so approved KCPL photographs can replace stock without layout changes.
export const images = {
  terminal: { id: 'photo-1670121180530-cfcba4438038', alt: 'Container-terminal infrastructure', credit: 'Nathan Cima', source: 'https://unsplash.com/photos/MHXJ9p64Jw8', position: 'center' },
  industrial: { id: 'photo-1565793298595-6a879b1d9492', alt: 'Industrial freight environment', credit: 'Marcin Jozwiak', source: 'https://unsplash.com/photos/kGoPcmpPT7c', position: 'center' },
  ocean: { id: 'photo-1578575437130-527eed3abbec', alt: 'Maritime cargo and container handling', credit: 'Andy Li', source: 'https://unsplash.com/photos/CpsTAUPoScw', position: 'center' },
  gateway: { id: 'photo-1706499856012-14f062c72b49', alt: 'Cargo-terminal operating infrastructure', credit: 'taro ohtani', source: 'https://unsplash.com/photos/5T5zmIqs0AM', position: 'center' },
  road: { id: 'photo-1760949481803-c116a9cd04fa', alt: 'Freight truck on a road through dry hills in Nevada, United States', credit: 'Zevon Jackson', source: 'https://unsplash.com/photos/8XxhSm4pQtw', position: 'center' },
};
export type ImageKey = keyof typeof images;
export function stockUrl(id: string, width: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}
