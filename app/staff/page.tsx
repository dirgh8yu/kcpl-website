import { staff } from '@/lib/backend';
import { requireChatGPTUser, chatGPTSignOutPath } from '@/app/chatgpt-auth';
import { Container } from '@/components/ui';
import { StaffDesk } from '@/components/staff-desk';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Enquiry desk | KCPL', robots: { index: false, follow: false } };
export default async function StaffPage() {
  await requireChatGPTUser('/staff');
  if (!await staff()) return <Container className="staff-desk"><h1>Staff access required.</h1><p>Your account does not have access to KCPL enquiries. Contact the website owner to request access.</p><a href={chatGPTSignOutPath('/staff')} target="_top">Sign out</a></Container>;
  return <Container className="staff-desk"><div className="staff-heading"><div><p className="eyebrow">KCPL / Operations</p><h1>Enquiry desk.</h1><p>Review cargo requirements, record follow-up and keep handovers clear.</p></div><a className="inline-link" href={chatGPTSignOutPath('/staff')} target="_top">Sign out</a></div><StaffDesk /></Container>;
}
