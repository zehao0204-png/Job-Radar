import { chatGPTSignOutPath, requireChatGPTUser } from './chatgpt-auth';
import { DeskShell } from './desk-shell';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await requireChatGPTUser('/');
  return <DeskShell initialView="companies" userName={user.displayName} signOutHref={chatGPTSignOutPath('/')} />;
}
