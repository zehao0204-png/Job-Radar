import { chatGPTSignOutPath, requireChatGPTUser } from '../chatgpt-auth';
import { DeskShell } from '../desk-shell';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const user = await requireChatGPTUser('/applications');
  return <DeskShell initialView="applications" userName={user.displayName} signOutHref={chatGPTSignOutPath('/')} />;
}
