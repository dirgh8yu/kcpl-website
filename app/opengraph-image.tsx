import { ImageResponse } from 'next/og';
export const alt = 'Kapileshwor Cargo — From Nepal. To the world.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#F6F6F3', color: '#101010', padding: '64px', borderLeft: '18px solid #DC143C', justifyContent: 'space-between' }}><div style={{ display: 'flex', fontSize: 26 }}>KAPILESHWOR CARGO PVT. LTD. · KATHMANDU, NEPAL</div><div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, letterSpacing: '-5px', lineHeight: 1.05 }}><span>FROM NEPAL.</span><span>TO THE WORLD.</span></div><div style={{ display: 'flex', fontSize: 28 }}>International freight. Customs. Project logistics.</div></div>, size);
}
