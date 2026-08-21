import Link from 'next/link';
import { chatGPTSignOutPath, requireChatGPTUser } from '../chatgpt-auth';
import { ApplicationsBoard } from './applications-board';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const user = await requireChatGPTUser('/applications');

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#19202e]">
      <header className="border-b border-[#e8ebf0] bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5c59e8] text-lg text-white">秋</span><span className="text-lg">秋招雷达</span></Link>
          <nav className="hidden items-center gap-8 text-sm text-[#687083] md:flex"><Link href="/">公司入口</Link><span className="font-semibold text-[#242a36]">投递看板</span></nav>
          <div className="flex items-center gap-3"><span className="hidden max-w-44 truncate text-xs text-[#7b8290] sm:block">{user.displayName}</span><a href={chatGPTSignOutPath('/')} className="rounded-lg border border-[#e1e4e9] px-3 py-2 text-xs text-[#656d7c]">退出</a></div>
        </div>
      </header>
      <ApplicationsBoard />
    </main>
  );
}
