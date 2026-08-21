'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { companies } from '../../data/companies';
import type { Application } from '../../db/schema';

const stages = ['准备投递', '已投递', '笔试/测评', '一面', '二面', '终面/HR面', 'Offer', '已结束'];
const activeStages = stages.slice(0, 7);

export function ApplicationsBoard() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/applications').then(async (response) => {
      if (!response.ok) throw new Error('加载失败，请刷新重试');
      setItems(await response.json() as Application[]);
    }).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: items.length,
    interviews: items.filter((item) => ['一面', '二面', '终面/HR面'].includes(item.stage)).length,
    offers: items.filter((item) => item.stage === 'Offer').length,
    upcoming: items.filter((item) => item.nextAt && item.nextAt >= new Date().toISOString().slice(0, 10)).length,
  }), [items]);

  async function addApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError('');
    const form = event.currentTarget;
    const response = await fetch('/api/applications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const body = await response.json() as Application & { error?: string };
    setSaving(false);
    if (!response.ok) return setError(body.error || '保存失败');
    setItems((current) => [body, ...current]); form.reset(); setShowForm(false);
  }

  async function changeStage(id: string, stage: string) {
    const response = await fetch('/api/applications', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, stage }) });
    if (!response.ok) return setError('阶段更新失败');
    setItems((current) => current.map((item) => item.id === id ? { ...item, stage } : item));
  }

  async function remove(id: string) {
    if (!window.confirm('确认删除这条投递记录？')) return;
    const response = await fetch(`/api/applications?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!response.ok) return setError('删除失败');
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-8 lg:px-8 lg:py-10">
      <section className="relative overflow-hidden border border-[#c7d1e5] bg-[#fcfdff] p-6 shadow-[10px_12px_0_rgba(54,87,214,.05)] sm:p-8">
        <div className="absolute right-8 top-0 hidden h-full w-52 border-x border-[#e0e5ef] bg-[linear-gradient(90deg,transparent_49.8%,rgba(54,87,214,.08)_50%,transparent_50.2%)] lg:block" aria-hidden="true" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3"><span className="h-px w-9 bg-[#3657d6]" /><p className="utility text-[9px] font-bold tracking-[.19em] text-[#3657d6]">APPLICATION ROUTE / LIVE</p></div>
            <h1 className="display-cn text-[clamp(2.25rem,5vw,4.4rem)] font-bold leading-none tracking-[-.055em]">我的投递航线</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f7a90]">每条记录是一枚坐标。把下一步时间标出来，沿着航线持续推进。</p>
          </div>
          <button onClick={() => setShowForm(true)} className="utility relative z-10 inline-flex items-center justify-center gap-4 bg-[#3657d6] px-5 py-4 text-[11px] font-bold tracking-[.05em] text-white shadow-[5px_5px_0_#f3b23c] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#f3b23c]">ADD COORDINATE <span className="text-base">＋</span></button>
        </div>
      </section>

      <section className="mt-8 grid border-y border-[#cbd4e7] bg-white/60 sm:grid-cols-2 lg:grid-cols-4">
        {[[stats.total, '累计投递', 'TOTAL'], [stats.interviews, '面试进行中', 'INTERVIEW'], [stats.upcoming, '近期安排', 'UPCOMING'], [stats.offers, '已获 Offer', 'ARRIVAL']].map(([value, label, code], index) => (
          <div key={label} className={`relative px-5 py-5 ${index < 3 ? 'border-b border-[#d8dfed] sm:border-r lg:border-b-0' : ''} ${index === 1 ? 'sm:border-b-0' : ''}`}>
            <div className="flex items-baseline justify-between"><strong className={`utility text-3xl font-medium tracking-[-.08em] ${index === 3 ? 'text-[#237a51]' : 'text-[#3657d6]'}`}>{String(value).padStart(2, '0')}</strong><span className="utility text-[8px] tracking-[.12em] text-[#9aa4b5]">{code}</span></div>
            <p className="mt-2 text-xs font-bold text-[#536078]">{label}</p>
            {index === 2 && Number(value) > 0 && <i className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#f3b23c] shadow-[0_0_0_4px_rgba(243,178,60,.15)]" />}
          </div>
        ))}
      </section>

      {error && <div role="alert" className="mt-6 flex items-center justify-between border-l-4 border-[#bd4d36] bg-[#fff4f1] px-4 py-3 text-sm text-[#9d3f2d]"><span>{error}</span><button onClick={() => setError('')} aria-label="关闭">×</button></div>}

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="utility text-[9px] font-bold tracking-[.17em] text-[#3657d6]">ROUTE MAP / 07 STATIONS</p><h2 className="display-cn mt-2 text-xl font-bold">推进路径</h2></div>
          <p className="utility hidden text-[8px] tracking-[.1em] text-[#98a2b4] sm:block">SCROLL HORIZONTALLY →</p>
        </div>
        <div className="overflow-x-auto border-y border-[#cbd4e7] pb-4 pt-4">
          <div className="grid min-w-[1190px] grid-cols-7 gap-px bg-[#cbd4e7] border-x border-[#cbd4e7]">
            {activeStages.map((stage, stageIndex) => {
              const stageItems = items.filter((item) => item.stage === stage);
              return <div key={stage} className="min-h-[380px] bg-[#f4f6fa]">
                <div className="border-b border-[#cbd4e7] bg-[#eef2f8] px-4 py-4">
                  <div className="flex items-center justify-between"><span className="utility text-[9px] font-bold text-[#3657d6]">ST.{String(stageIndex + 1).padStart(2, '0')}</span><span className="utility text-[9px] text-[#8792a5]">{String(stageItems.length).padStart(2, '0')}</span></div>
                  <h3 className="mt-2 text-xs font-bold text-[#455168]">{stage}</h3>
                </div>
                <div className="space-y-3 p-3">
                  {stageItems.map((item) => <article key={item.id} className="relative border border-[#cdd6e6] bg-white p-4 shadow-[4px_4px_0_rgba(54,87,214,.05)]">
                    <span className="absolute right-0 top-0 h-3 w-3 border-b border-l border-[#cdd6e6] bg-[#f3b23c]" aria-hidden="true" />
                    <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h4 className="display-cn truncate text-base font-bold">{item.companyName}</h4><p className="mt-1 text-[11px] leading-5 text-[#768197]">{item.position}</p></div><button onClick={() => remove(item.id)} className="utility text-xs text-[#a1a9b8] hover:text-[#bd4d36]" aria-label={`删除${item.companyName}投递记录`}>×</button></div>
                    <dl className="utility mt-4 space-y-1.5 text-[9px] text-[#8993a6]"><div className="flex justify-between gap-2"><dt>APPLIED</dt><dd>{item.appliedAt}</dd></div>{item.location && <div className="flex justify-between gap-2"><dt>LOC.</dt><dd>{item.location}</dd></div>}{item.nextAt && <div className="flex justify-between gap-2 font-bold text-[#a36608]"><dt>NEXT</dt><dd>{item.nextAt}</dd></div>}</dl>
                    <select value={item.stage} onChange={(event) => changeStage(item.id, event.target.value)} className="mt-4 w-full border border-[#cbd4e3] bg-[#f6f8fb] px-2 py-2 text-[11px] text-[#556177] outline-none" aria-label={`更新${item.companyName}阶段`}>{stages.map((value) => <option key={value}>{value}</option>)}</select>
                  </article>)}
                  {!stageItems.length && <div className="grid min-h-28 place-items-center border border-dashed border-[#c4cede] px-3 text-center"><span className="utility text-[9px] tracking-[.1em] text-[#a0a9b9]">NO COORDINATE</span></div>}
                </div>
              </div>;
            })}
          </div>
        </div>
      </section>

      {loading && <p className="utility py-10 text-center text-[10px] tracking-[.1em] text-[#8792a5]">LOADING YOUR ROUTE…</p>}

      {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-[#11192a]/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="new-application-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-[#9facc5] bg-[#fdfefe] p-6 shadow-[10px_10px_0_rgba(243,178,60,.55)] sm:p-8">
          <div className="flex items-start justify-between gap-5"><div><p className="utility text-[9px] font-bold tracking-[.16em] text-[#3657d6]">NEW COORDINATE</p><h2 id="new-application-title" className="display-cn mt-2 text-2xl font-bold">新增投递记录</h2><p className="mt-2 text-xs leading-5 text-[#7c8799]">信息由你手动记录，不会同步到企业官网。</p></div><button onClick={() => setShowForm(false)} className="utility grid h-9 w-9 shrink-0 place-items-center border border-[#c7d0df] text-[#677389] hover:border-[#3657d6] hover:text-[#3657d6]" aria-label="关闭">×</button></div>
          <form onSubmit={addApplication} className="mt-7 grid gap-4 sm:grid-cols-2">
            <Field label="公司 *" wide><select name="companyId" required className="route-input"><option value="">请选择公司</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name} · {company.industry}</option>)}</select></Field>
            <Field label="岗位名称 *" wide><input name="position" required maxLength={80} placeholder="例如：产品经理" className="route-input" /></Field>
            <Field label="投递日期"><input name="appliedAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="route-input" /></Field>
            <Field label="当前阶段"><select name="stage" defaultValue="已投递" className="route-input">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></Field>
            <Field label="工作地点"><input name="location" maxLength={40} placeholder="例如：上海" className="route-input" /></Field>
            <Field label="下一步时间"><input name="nextAt" type="date" className="route-input" /></Field>
            <Field label="备注" wide><textarea name="notes" maxLength={500} rows={3} placeholder="记录笔试、面试或联系人信息" className="route-input resize-none" /></Field>
            <div className="flex gap-3 pt-2 sm:col-span-2"><button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-[#bfc9da] py-3 text-sm font-bold text-[#68748a] hover:bg-[#f1f4f9]">取消</button><button disabled={saving} className="flex-1 bg-[#3657d6] py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? '保存中…' : '保存坐标'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? 'sm:col-span-2' : ''}><span className="utility mb-2 block text-[9px] font-bold tracking-[.1em] text-[#58657b]">{label}</span>{children}</label>;
}
