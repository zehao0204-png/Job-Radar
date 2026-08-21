'use client';

import { useMemo, useState } from 'react';
import type { Company, Industry, RecruitmentStatus } from '../data/companies';

const PAGE_SIZE = 15;
const industries: Array<'全部' | Industry> = ['全部', '互联网', '汽车', '芯片', '制造业', '咨询'];
const statuses: Array<'全部状态' | RecruitmentStatus> = ['全部状态', '开放', '预热', '待开放', '待核验'];

export function CompanyExplorer({ companies, signedIn, signInHref }: { companies: Company[]; signedIn: boolean; signInHref: string }) {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState<(typeof industries)[number]>('全部');
  const [status, setStatus] = useState<(typeof statuses)[number]>('全部状态');
  const [page, setPage] = useState(1);
  const [followed, setFollowed] = useState<string[]>([]);

  const filtered = useMemo(() => companies.filter((company) => {
    const matchesQuery = !query || company.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesIndustry = industry === '全部' || company.industry === industry;
    const matchesStatus = status === '全部状态' || company.status === status;
    return matchesQuery && matchesIndustry && matchesStatus;
  }), [companies, industry, query, status]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const filter = (next: typeof industry) => { setIndustry(next); setPage(1); };

  return (
    <section id="company-list" className="mt-6 overflow-hidden rounded-2xl border border-[#e8eaee] bg-white shadow-[0_8px_25px_rgba(31,38,51,.04)]">
      <div className="border-b border-[#edf0f3] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div><h2 className="font-bold">120 家公司官方入口</h2><p className="mt-1 text-xs text-[#9299a6]">开放状态只采用官方公开信息；待核验不代表未开放</p></div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-[#e2e5ea] bg-[#f8f9fb] px-3 py-2.5 focus-within:border-[#7774f5] xl:max-w-sm">
            <span aria-hidden="true" className="text-[#969da9]">⌕</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a8adb7]" placeholder="搜索公司名称" aria-label="搜索公司名称" />
            {query && <button onClick={() => setQuery('')} className="text-xs text-[#8f96a2]" aria-label="清空搜索">清除</button>}
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
            {industries.map((item) => <button key={item} onClick={() => filter(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 font-semibold ${industry === item ? 'bg-[#eeedff] text-[#5c59e8]' : 'text-[#7a8291] hover:bg-[#f5f6f8]'}`}>{item}</button>)}
          </div>
          <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} className="rounded-lg border border-[#e3e6eb] bg-white px-3 py-2 text-xs text-[#5e6675] outline-none" aria-label="招聘状态筛选">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="divide-y divide-[#f0f1f4]">
        {visible.map((company) => (
          <article key={company.id} className="grid gap-4 px-5 py-4 transition hover:bg-[#fafbfc] md:grid-cols-[minmax(190px,1fr)_130px_150px_210px] md:items-center sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#ebecef] bg-[#f8f8fa] px-1 text-center text-[11px] font-bold text-[#4b5361]">{company.name.slice(0, 3)}</span>
              <div className="min-w-0"><h3 className="truncate text-sm font-semibold">{company.name}</h3><p className="mt-1 text-xs text-[#9ca2ae]">{company.industry} · {company.batch}</p></div>
            </div>
            <div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${company.status === '开放' ? 'bg-[#eaf8f0] text-[#279360]' : company.status === '预热' ? 'bg-[#fff5e4] text-[#d38820]' : company.status === '待开放' ? 'bg-[#f1f2f5] text-[#7e8490]' : 'bg-[#f2f3f5] text-[#979daa]'}`}><i className="mr-1.5 mt-[5px] h-1.5 w-1.5 rounded-full bg-current" />{company.status}</span></div>
            <div><p className="text-xs text-[#a3a8b2]">截止：{company.deadline}</p><p className="mt-1 text-[11px] text-[#a3a8b2]">核验：{company.verifiedAt}</p></div>
            <div className="flex items-center gap-2 md:justify-end">
              <a href={company.url} target="_blank" rel="noreferrer" className="rounded-lg bg-[#242a36] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#11151d]">官方投递入口 ↗</a>
              {signedIn ? (
                <button onClick={() => setFollowed((items) => items.includes(company.id) ? items.filter((id) => id !== company.id) : [...items, company.id])} aria-label={`${followed.includes(company.id) ? '取消关注' : '关注'}${company.name}`} className={`grid h-8 w-8 place-items-center rounded-lg border text-sm ${followed.includes(company.id) ? 'border-[#7774f5] bg-[#eeedff] text-[#5c59e8]' : 'border-[#e5e7eb] text-[#8b92a0]'}`}>{followed.includes(company.id) ? '✓' : '＋'}</button>
              ) : (
                <a href={signInHref} aria-label={`登录后关注${company.name}`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#e5e7eb] text-sm text-[#8b92a0]">＋</a>
              )}
            </div>
          </article>
        ))}
        {!visible.length && <div className="px-6 py-16 text-center text-sm text-[#8d94a0]">没有匹配的公司，换个关键词或筛选条件试试。</div>}
      </div>
      {visible.length < filtered.length && <div className="border-t border-[#edf0f3] p-4 text-center"><button onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-[#dfe2e7] px-5 py-2.5 text-xs font-semibold text-[#5e6675] hover:border-[#7774f5] hover:text-[#5c59e8]">继续加载 · 还有 {filtered.length - visible.length} 家</button></div>}
      <p className="border-t border-[#f0f1f4] bg-[#fafbfc] px-6 py-3 text-center text-[11px] text-[#a0a6b1]">当前展示 {visible.length} / {filtered.length} 家匹配公司</p>
    </section>
  );
}
