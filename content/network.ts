export const networkCoverage = {
  base: { title: 'Kathmandu, Nepal', text: 'International coordination and practical Nepal-side support.' },
  counterparts: [
    { title: 'India gateways', text: 'Ocean cargo via Visakhapatnam (Vizag) and Kolkata, connected with onward transit and Nepal-side customs arrangements.' },
    { title: 'China–Nepal', text: 'Container and land-border coordination with the relevant origin and border operating parties.' },
    { title: 'International counterparts', text: 'Air and ocean freight handovers with overseas forwarding and destination agents.' },
  ],
};
export const partnerHandovers = [
  { stage: 'Origin', scope: 'Cargo preparation, pickup and export-side arrangements', responsibility: 'Confirm with the shipper and origin counterpart.' },
  { stage: 'International / transit', scope: 'Freight, gateway documentation and onward handover', responsibility: 'Agree the scope with the relevant freight and transit parties.' },
  { stage: 'Nepal-side coordination', scope: 'Customs requirements, inland movement and delivery planning', responsibility: 'Discuss the Nepal-side scope with KCPL.' },
  { stage: 'Receiving site', scope: 'Access, receiving, unloading and positioning arrangements', responsibility: 'Confirm responsibilities with the receiving team before movement.' },
];

// Company-provided locations. No street addresses, ownership or capacity inferred.
export const branchOffices = [
  { country: 'Nepal', locations: ['Birgunj customs office', 'Nepalgunj customs office', 'Bhairahawa customs office'] },
  { country: 'India', locations: ['Delhi', 'Kolkata'] },
];
export const warehouseFacilities = [
  { country: 'India', locations: ['Raxaul'] },
  { country: 'Nepal', locations: ['Birgunj', 'Nepalgunj customs area', 'Surkhet — near the airport', 'Chovar customs office, Kathmandu', 'Thimi store, Bhaktapur'] },
];
