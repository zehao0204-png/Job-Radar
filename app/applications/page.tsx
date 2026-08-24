import { chatGPTSignOutPath, requireChatGPTUser } from '../chatgpt-auth';
import { ApplicationsBoard } from './applications-board';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const user = await requireChatGPTUser('/applications');

  return (
    <main className="blueprint-grid min-h-screen text-[#172033]">
      <header className="sticky top-0 z-30 border-b border-[#ccd5e9] bg-[#f7f9fc]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between px-5 lg:px-8">
          <a href="/" className="group flex items-center gap-3" aria-label="秋招雷达首页">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#3657d6] bg-[#3657d6] text-[11px] font-black text-white shadow-[0_0_0_4px_rgba(54,87,214,.08)]">R<span className="absolute right-1.5 top-1 text-[7px] font-medium text-[#f3bf55]">27</span></span>
            <span><strong className="display-cn block text-[17px] leading-none tracking-[.04em]">秋招雷达</strong><small className="utility mt-1 block text-[8px] tracking-[.2em] text-[#7d88a0]">PERSONAL DESK</small></span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-[#d7deed] bg-white p-1 text-xs md:flex">
            <a className="rounded-full px-5 py-2.5 font-semibold text-[#5d6880] transition hover:bg-[#eef2fa] hover:text-[#172033]" href="/">公司入口</a>
            <span className="rounded-full bg-[#172033] px-5 py-2.5 font-semibold text-white">投递航线</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="utility hidden max-w-40 truncate text-[9px] tracking-[.05em] text-[#7b8598] sm:block">PILOT / {user.displayName}</span>
            <a href={chatGPTSignOutPath('/')} className="utility border-b border-[#aeb9cc] pb-1 text-[9px] font-bold tracking-[.08em] text-[#657087] hover:border-[#3657d6] hover:text-[#3657d6]">SIGN OUT</a>
          </div>
        </div>
      </header>
      <ApplicationsBoard />
    </main>
  );
}
