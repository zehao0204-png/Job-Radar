'use client';

import { useMemo, useState } from 'react';
import type { Company, Industry, RecruitmentStatus } from '../data/companies';

const PAGE_SIZE = 15;
const industries: Array<'全部' | Industry> = ['全部', '互联网', '汽车', '芯片', '制造业', '咨询'];
const statuses: Array<'全部状态' | RecruitmentStatus> = ['全部状态', '开放', '预热', '待开放', '待核验'];
const statusClass: Record<RecruitmentStatus, string> = {
  开放: 'border-[#88bca2] bg-[#f1faf5] text-[#237a51]',
  预热: 'border-[#e5bd69] bg-[#fff8e9] text-[#a36608]',
  待开放: 'border-[#cbd4e3] bg-[#f5f7fa] text-[#667187]',
  待核验: 'border-[#d6dce7] bg-white text-[#7d879b]',
};

export function CompanyExplorer({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState<(typeof industries)[number]>('全部');
  const [status, setStatus] = useState<(typeof statuses)[number]>('全部状态');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => companies.filter((company) => {
    const matchesQuery = !query || company.name.toLowerCase().includes(query.trim().toLowerCase());
    const matchesIndustry = industry === '全部' || company.industry === industry;
    const matchesStatus = status === '全部状态' || company.status === status;
    return matchesQuery && matchesIndustry && matchesStatus;
  }), [companies, industry, query, status]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const filter = (next: typeof industry) => { setIndustry(next); setPage(1); };

  return (
    <section id="company-list" className="mt-9 scroll-mt-24 border border-[#c7d1e5] bg-[#fbfcfe] shadow-[9px_10px_0_rgba(54,87,214,.045)]">
      <div className="grid border-b border-[#cbd4e7] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="px-5 py-6 sm:px-7">
          <div className="flex items-start gap-4">
            <span className="utility mt-1 grid h-8 w-8 shrink-0 place-items-center bg-[#172033] text-[9px] font-bold text-white">A—Z</span>
            <div>
              <p className="utility text-[9px] font-bold tracking-[.17em] text-[#3657d6]">COMPANY DIRECTORY / 120</p>
              <h2 className="display-cn mt-2 text-2xl font-bold tracking-[-.03em]">名企官方入口索引</h2>
              <p className="mt-2 text-xs leading-5 text-[#7a859a]">状态只采用官方公开信息；“待核验”不等于尚未开放。</p>
            </div>
          </div>
        </div>
        <div className="flex items-center border-t border-[#d9e0ed] p-5 xl:border-l xl:border-t-0">
          <label className="group flex w-full items-center gap-3 border-b-2 border-[#172033] bg-white px-1 py-3 focus-within:border-[#3657d6]">
            <span aria-hidden="true" className="utility text-xs text-[#3657d6]">SEARCH /</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9ba4b5]" placeholder="输入公司名称" aria-label="搜索公司名称" />
            {query && <button onClick={() => setQuery('')} className="utility text-[9px] text-[#717c91] hover:text-[#3657d6]" aria-label="清空搜索">CLEAR ×</button>}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-[#cbd4e7] bg-[#f2f5fa] px-5 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-7">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {industries.map((item, index) => <button key={item} onClick={() => filter(item)} className={`utility whitespace-nowrap border px-3 py-2 text-[10px] font-bold tracking-[.05em] transition ${industry === item ? 'border-[#3657d6] bg-[#3657d6] text-white' : 'border-transparent text-[#68748b] hover:border-[#b9c5db] hover:bg-white'}`}>{String(index).padStart(2, '0')} {item}</button>)}
        </div>
        <label className="flex items-center gap-3">
          <span className="utility text-[9px] font-bold tracking-[.12em] text-[#7d8799]">STATUS</span>
          <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }} className="border border-[#bdc8dc] bg-white px-3 py-2 text-xs text-[#4f5b71] outline-none" aria-label="招聘状态筛选">
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="hidden grid-cols-[74px_minmax(210px,1fr)_120px_180px_190px] border-b border-[#cbd4e7] bg-white px-6 py-3 md:grid">
        {['编号', '公司 / 行业', '状态', '时间坐标', '行动'].map((label) => <span key={label} className="utility text-[9px] font-bold tracking-[.14em] text-[#8d97a9]">{label}</span>)}
      </div>

      <div className="divide-y divide-[#dce2ed]">
        {visible.map((company) => {
          const companyIndex = companies.findIndex((item) => item.id === company.id) + 1;
          return (
            <article key={company.id} className="group grid gap-4 px-5 py-5 transition hover:bg-white md:grid-cols-[74px_minmax(210px,1fr)_120px_180px_190px] md:items-center sm:px-6">
              <div className="utility flex items-center gap-3 text-[10px] text-[#8490a4]">
                <span className="h-px w-4 bg-[#bcc7da] transition-all group-hover:w-7 group-hover:bg-[#3657d6]" />
                {String(companyIndex).padStart(3, '0')}
              </div>
              <div className="min-w-0">
                <h3 className="display-cn truncate text-[17px] font-bold tracking-[-.02em] text-[#202a3e]">{company.name}</h3>
                <p className="utility mt-1.5 text-[9px] tracking-[.07em] text-[#8993a6]">{company.industry} / {company.batch}</p>
              </div>
              <div><span className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[11px] font-bold ${statusClass[company.status]}`}><i className="h-1.5 w-1.5 rounded-full bg-current" />{company.status}</span></div>
              <div className="text-[11px] leading-5 text-[#7b8699]"><p>截止 / {company.deadline}</p><p className="utility text-[9px] text-[#9aa3b4]">CHECK {company.verifiedAt}</p></div>
              <div className="md:text-right">
                <a href={company.url} target="_blank" rel="noreferrer" className="utility inline-flex items-center gap-4 border border-[#3657d6] px-4 py-2.5 text-[10px] font-bold tracking-[.04em] text-[#3657d6] transition hover:bg-[#3657d6] hover:text-white">官网投递入口 <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          );
        })}
        {!visible.length && <div className="px-6 py-20 text-center"><p className="utility text-[10px] tracking-[.15em] text-[#3657d6]">NO MATCHED COORDINATES</p><p className="mt-3 text-sm text-[#7d8799]">没有匹配的公司，换个关键词或筛选条件试试。</p></div>}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-[#cbd4e7] bg-[#f4f6fa] px-6 py-4 sm:flex-row">
        <p className="utility text-[9px] tracking-[.08em] text-[#8892a5]">DISPLAY {String(visible.length).padStart(3, '0')} / MATCHED {String(filtered.length).padStart(3, '0')}</p>
        {visible.length < filtered.length && <button onClick={() => setPage((value) => value + 1)} className="utility border-b border-[#3657d6] pb-1 text-[10px] font-bold tracking-[.08em] text-[#3657d6] transition hover:border-[#172033] hover:text-[#172033]">加载下一批 / {filtered.length - visible.length} →</button>}
      </div>
    </section>
  );
}
