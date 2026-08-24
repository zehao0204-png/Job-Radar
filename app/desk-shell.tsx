'use client';

import { useEffect, useState } from 'react';
import { companies, industryCounts } from '../data/companies';
import type { Industry } from '../data/companies';
import { ApplicationsBoard } from './applications/applications-board';
import { CompanyExplorer } from './company-explorer';

type View = 'companies' | 'applications';

export function DeskShell({ initialView, userName, signOutHref }: { initialView: View; userName: string; signOutHref: string }) {
  const [view, setView] = useState(initialView);
  const [industry, setIndustry] = useState<'全部' | Industry>('全部');
  const openCount = companies.filter((company) => company.status === '开放').length;
  const preheatCount = companies.filter((company) => company.status === '预热').length;
  const pendingCount = companies.filter((company) => company.status === '待核验').length;

  useEffect(() => {
    const syncView = () => setView(window.location.pathname === '/applications' ? 'applications' : 'companies');
    window.addEventListener('popstate', syncView);
    return () => window.removeEventListener('popstate', syncView);
  }, []);

  function show(next: View) {
    if (next === view) return;
    window.history.pushState(null, '', next === 'applications' ? '/applications' : '/');
    setView(next);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function selectIndustry(next: '全部' | Industry) {
    setIndustry(next);
    requestAnimationFrame(() => document.getElementById('company-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  return (
    <main className="blueprint-grid min-h-screen text-[#172033]">
      <header className="sticky top-0 z-30 border-b border-[#ccd5e9] bg-[#f7f9fc]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center justify-between px-5 lg:px-8">
          <button onClick={() => show('companies')} className="group flex items-center gap-3 text-left" aria-label="秋招雷达首页">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#3657d6] bg-[#3657d6] text-[11px] font-black text-white shadow-[0_0_0_4px_rgba(54,87,214,.08)]">R<span className="absolute right-1.5 top-1 text-[7px] font-medium text-[#f3bf55]">27</span></span>
            <span><strong className="display-cn block text-[17px] leading-none tracking-[.04em]">秋招雷达</strong><small className="utility mt-1 block text-[8px] tracking-[.2em] text-[#7d88a0]">PERSONAL DESK</small></span>
          </button>
          <nav className="hidden items-center gap-1 rounded-full border border-[#d7deed] bg-white p-1 text-xs md:flex" aria-label="主导航">
            <button onClick={() => show('companies')} aria-current={view === 'companies' ? 'page' : undefined} className={`rounded-full px-5 py-2.5 font-semibold transition ${view === 'companies' ? 'bg-[#172033] text-white' : 'text-[#5d6880] hover:bg-[#eef2fa] hover:text-[#172033]'}`}>公司入口</button>
            <button onClick={() => show('applications')} aria-current={view === 'applications' ? 'page' : undefined} className={`rounded-full px-5 py-2.5 font-semibold transition ${view === 'applications' ? 'bg-[#172033] text-white' : 'text-[#5d6880] hover:bg-[#eef2fa] hover:text-[#172033]'}`}>投递航线</button>
          </nav>
          {view === 'companies' ? (
            <button onClick={() => show('applications')} className="utility inline-flex items-center gap-2 border-b border-[#3657d6] pb-1 text-[11px] font-bold tracking-[.08em] text-[#3657d6] transition hover:border-[#172033] hover:text-[#172033]">OPEN BOARD <span aria-hidden="true">↗</span></button>
          ) : (
            <div className="flex items-center gap-4"><span className="utility hidden max-w-40 truncate text-[9px] tracking-[.05em] text-[#7b8598] sm:block">PILOT / {userName}</span><a href={signOutHref} className="utility border-b border-[#aeb9cc] pb-1 text-[9px] font-bold tracking-[.08em] text-[#657087] hover:border-[#3657d6] hover:text-[#3657d6]">SIGN OUT</a></div>
          )}
        </div>
      </header>

      <div hidden={view !== 'companies'}>
        <div className="mx-auto grid max-w-[1480px] gap-7 px-5 py-7 lg:grid-cols-[218px_minmax(0,1fr)] lg:px-8 lg:py-9">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-9">
              <section>
                <div className="mb-4 flex items-center justify-between border-b border-[#cbd4e7] pb-3"><p className="utility text-[10px] font-bold tracking-[.16em] text-[#526078]">行业索引</p><span className="utility text-[9px] text-[#98a1b3]">INDEX</span></div>
                <div>
                  {industryCounts.map(({ name, count }) => {
                    const active = name === industry;
                    return <button onClick={() => selectIndustry(name)} key={name} aria-pressed={active} className={`group flex w-full items-center justify-between border-b border-[#e0e5ef] px-1 py-3 text-left text-sm transition ${active ? 'font-bold text-[#3657d6]' : 'text-[#657088] hover:pl-2 hover:text-[#172033]'}`}><span className="flex items-center gap-2">{active && <i className="h-1.5 w-1.5 rounded-full bg-[#f3b23c]" />}{name === '全部' ? '全部公司' : name}</span><span className="utility text-[10px] text-[#96a0b4]">{String(count).padStart(3, '0')}</span></button>;
                  })}
                </div>
              </section>
              <section className="border-l-2 border-[#3657d6] bg-white/65 px-5 py-4 shadow-[8px_10px_30px_rgba(34,49,83,.05)]">
                <p className="utility text-[9px] font-bold tracking-[.16em] text-[#3657d6]">MY ROUTE / 03 STEPS</p>
                <ol className="mt-4 space-y-4 text-xs text-[#5f6a80]">{['查找公司官网入口', '完成网申并记录', '推进笔面试阶段'].map((item, index) => <li key={item} className="flex items-center gap-3"><span className="utility grid h-5 w-5 place-items-center rounded-full border border-[#bcc7de] text-[8px] text-[#3657d6]">{index + 1}</span><span>{item}</span></li>)}</ol>
              </section>
            </div>
          </aside>

          <div className="min-w-0">
            <section className="relative min-h-[330px] overflow-hidden border border-[#c7d1e5] bg-[#fdfefe] px-6 py-7 shadow-[12px_14px_0_rgba(54,87,214,.06)] sm:px-10 sm:py-10 lg:px-12">
              <div className="relative z-10 max-w-[670px]">
                <div className="mb-8 flex items-center gap-3"><span className="h-px w-10 bg-[#3657d6]" /><p className="utility text-[10px] font-bold tracking-[.2em] text-[#3657d6]">27 CAMPUS / PRIVATE COMMAND DESK</p></div>
                <h1 className="display-cn text-[clamp(2.5rem,5vw,4.7rem)] font-bold leading-[1.05] tracking-[-.055em] text-[#172033]">今天，推进哪一家公司？</h1>
                <p className="mt-6 max-w-xl text-sm leading-7 text-[#667187]">把分散的官网入口和投递进度收回一张桌面。每次打开，只决定下一步往哪里走。</p>
                <div className="mt-8 flex flex-wrap items-center gap-5"><button onClick={() => selectIndustry('全部')} className="group inline-flex items-center gap-4 bg-[#3657d6] px-5 py-3.5 text-sm font-bold text-white shadow-[5px_5px_0_#f3b23c] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#f3b23c]">进入公司索引 <span className="transition group-hover:translate-x-1">→</span></button><button onClick={() => show('applications')} className="text-xs font-semibold text-[#536079] underline decoration-[#aab5cb] underline-offset-4 hover:text-[#3657d6]">查看我的投递航线</button></div>
              </div>
              <div className="radar-field pointer-events-none absolute -right-20 -top-20 hidden h-[430px] w-[430px] lg:block" aria-hidden="true"><span className="radar-ring inset-[8%]" /><span className="radar-ring inset-[22%]" /><span className="radar-ring inset-[36%]" /><span className="radar-ring inset-[49%]" /><span className="radar-cross radar-cross-x" /><span className="radar-cross radar-cross-y" /><span className="radar-sweep" /><span className="radar-dot left-[31%] top-[38%]" /><span className="radar-dot left-[62%] top-[63%]" /><span className="radar-dot left-[53%] top-[25%]" /></div>
              <span className="utility absolute bottom-4 right-5 text-[8px] tracking-[.15em] text-[#a5adbd]">COORD / 27°N · AUTUMN</span>
            </section>

            <section className="mt-7 grid border-y border-[#cbd4e7] bg-white/55 sm:grid-cols-3">
              {[[String(openCount).padStart(2, '0'), '已核验开放', '有明确27届招聘证据'], [String(pendingCount).padStart(2, '0'), '待核验', `另有 ${preheatCount} 家预热`], [String(companies.length), '公司入口', '覆盖五个重点行业']].map(([value, label, note], index) => <div key={label} className={`grid grid-cols-[auto_1fr] items-center gap-4 px-5 py-5 ${index < 2 ? 'border-b border-[#d8dfed] sm:border-b-0 sm:border-r' : ''}`}><strong className="utility text-3xl font-medium tracking-[-.08em] text-[#3657d6]">{value}</strong><div><p className="text-xs font-bold text-[#313c51]">{label}</p><p className="mt-1 text-[10px] text-[#8b95a8]">{note}</p></div></div>)}
            </section>

            <CompanyExplorer companies={companies} selectedIndustry={industry} />
          </div>
        </div>
      </div>

      <div hidden={view !== 'applications'}><ApplicationsBoard /></div>
    </main>
  );
}
