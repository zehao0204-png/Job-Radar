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
    <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold tracking-[.15em] text-[#8e95a3]">MY APPLICATIONS</p><h1 className="mt-2 text-2xl font-bold tracking-tight">我的投递看板</h1><p className="mt-1 text-sm text-[#7f8795]">记录每一次申请，及时推进下一步。</p></div>
        <button onClick={() => setShowForm(true)} className="rounded-xl bg-[#5c59e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(92,89,232,.2)]">＋ 新增投递记录</button>
      </div>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[[stats.total, '累计投递', '全部记录'], [stats.interviews, '面试进行中', '继续加油'], [stats.upcoming, '近期安排', '记得按时参加'], [stats.offers, '已获 Offer', '期待好消息']].map(([value, label, meta], index) => (
          <div key={label} className="rounded-2xl border border-[#e8eaee] bg-white p-5"><div className="flex items-start justify-between"><strong className={`text-3xl ${index === 3 ? 'text-[#279360]' : 'text-[#272e3b]'}`}>{value}</strong><span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-[10px] text-[#818895]">{meta}</span></div><p className="mt-2 text-sm text-[#777f8e]">{label}</p></div>
        ))}
      </section>

      {error && <div role="alert" className="mt-5 flex items-center justify-between rounded-xl bg-[#fff0ec] px-4 py-3 text-sm text-[#bd4d36]"><span>{error}</span><button onClick={() => setError('')} aria-label="关闭">×</button></div>}

      <section className="mt-7 overflow-x-auto pb-4">
        <div className="grid min-w-[1120px] grid-cols-7 gap-3">
          {activeStages.map((stage) => {
            const stageItems = items.filter((item) => item.stage === stage);
            return <div key={stage} className="rounded-2xl bg-[#eef0f4] p-3">
              <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-xs font-bold text-[#555d6c]">{stage}</h2><span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-[#8b92a0]">{stageItems.length}</span></div>
              <div className="space-y-3">
                {stageItems.map((item) => <article key={item.id} className="rounded-xl border border-[#e4e6ea] bg-white p-3.5 shadow-[0_4px_10px_rgba(31,38,51,.035)]">
                  <div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-semibold">{item.companyName}</h3><p className="mt-1 text-xs leading-5 text-[#858c99]">{item.position}</p></div><button onClick={() => remove(item.id)} className="text-sm text-[#b0b5be] hover:text-[#e3654b]" aria-label={`删除${item.companyName}投递记录`}>×</button></div>
                  <div className="mt-3 space-y-1 text-[10px] text-[#9aa0ac]"><p>投递：{item.appliedAt}</p>{item.location && <p>地点：{item.location}</p>}{item.nextAt && <p className="font-semibold text-[#d38820]">下一步：{item.nextAt}</p>}</div>
                  <select value={item.stage} onChange={(event) => changeStage(item.id, event.target.value)} className="mt-3 w-full rounded-lg border border-[#e5e7eb] bg-[#fafbfc] px-2 py-2 text-[11px] text-[#626a78] outline-none" aria-label={`更新${item.companyName}阶段`}>{stages.map((value) => <option key={value}>{value}</option>)}</select>
                </article>)}
                {!stageItems.length && <div className="rounded-xl border border-dashed border-[#d8dbe1] px-3 py-8 text-center text-[11px] text-[#a2a8b3]">暂无记录</div>}
              </div>
            </div>;
          })}
        </div>
      </section>

      {loading && <p className="py-10 text-center text-sm text-[#969da9]">正在加载你的投递记录…</p>}

      {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-[#171b24]/45 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="new-application-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl sm:p-7">
          <div className="flex items-center justify-between"><div><h2 id="new-application-title" className="text-lg font-bold">新增投递记录</h2><p className="mt-1 text-xs text-[#8e95a1]">岗位信息由你手动记录，不会同步到企业官网。</p></div><button onClick={() => setShowForm(false)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f3f4f6] text-[#7c8491]" aria-label="关闭">×</button></div>
          <form onSubmit={addApplication} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">公司 *</span><select name="companyId" required className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]"><option value="">请选择公司</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name} · {company.industry}</option>)}</select></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">岗位名称 *</span><input name="position" required maxLength={80} placeholder="例如：产品经理" className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]" /></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">投递日期</span><input name="appliedAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]" /></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">当前阶段</span><select name="stage" defaultValue="已投递" className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">工作地点</span><input name="location" maxLength={40} placeholder="例如：上海" className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]" /></label>
            <label><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">下一步时间</span><input name="nextAt" type="date" className="w-full rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]" /></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-[#5e6674]">备注</span><textarea name="notes" maxLength={500} rows={3} placeholder="记录笔试、面试或联系人信息" className="w-full resize-none rounded-xl border border-[#e0e3e8] px-3 py-3 text-sm outline-none focus:border-[#7774f5]" /></label>
            <div className="flex gap-3 pt-2 sm:col-span-2"><button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border border-[#e0e3e8] py-3 text-sm font-semibold text-[#687080]">取消</button><button disabled={saving} className="flex-1 rounded-xl bg-[#5c59e8] py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? '保存中…' : '保存记录'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
