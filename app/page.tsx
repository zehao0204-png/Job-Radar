import Link from 'next/link';
import { chatGPTSignInPath, getChatGPTUser } from './chatgpt-auth';
import { companies, industryCounts } from '../data/companies';
import { CompanyExplorer } from './company-explorer';

export default async function Home() {
  const user = await getChatGPTUser();

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#19202e]">
      <header className="sticky top-0 z-20 border-b border-[#e8ebf0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5c59e8] text-lg text-white shadow-[0_6px_16px_rgba(92,89,232,.24)]">秋</span>
            <span className="text-lg">秋招雷达</span>
            <span className="rounded-full bg-[#eeedff] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#5c59e8]">2027</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-[#687083] md:flex">
            <Link className="font-semibold text-[#242a36]" href="/">招聘情报</Link>
            <Link className="transition hover:text-[#242a36]" href="/applications">我的投递</Link>
            <Link className="transition hover:text-[#242a36]" href="/applications">提醒中心</Link>
          </nav>
          {user ? (
            <Link href="/applications" className="rounded-xl bg-[#f1f2f5] px-4 py-2 text-sm font-semibold">我的看板</Link>
          ) : (
            <a href={chatGPTSignInPath('/applications')} className="rounded-xl bg-[#242a36] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#11151d]">登录 / 注册</a>
          )}
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-7 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <section>
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[.15em] text-[#a0a6b2]">公司行业</p>
              <div className="space-y-1">
                {industryCounts.map(({ name, count }, index) => (
                  <a href="#company-list" key={name} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${index === 0 ? 'bg-white font-semibold text-[#5c59e8] shadow-sm' : 'text-[#697184] hover:bg-white/70'}`}>
                    <span>{name === '全部' ? '全部公司' : name}</span><span className="text-xs text-[#a7acb7]">{count}</span>
                  </a>
                ))}
              </div>
            </section>
            <section className="rounded-2xl bg-[#242a36] p-5 text-white shadow-[0_18px_35px_rgba(23,28,38,.12)]">
              <p className="text-sm font-semibold">不错过开放时间</p>
              <p className="mt-2 text-xs leading-5 text-white/60">关注目标公司，状态变化和临近截止时第一时间提醒。</p>
              <a href={user ? '/applications' : chatGPTSignInPath('/applications')} className="mt-4 block rounded-xl bg-white px-3 py-2.5 text-center text-xs font-semibold text-[#242a36]">开启我的提醒</a>
            </section>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="relative overflow-hidden rounded-[28px] bg-[#5c59e8] px-6 py-7 text-white shadow-[0_20px_45px_rgba(92,89,232,.18)] sm:px-8">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-semibold tracking-[.18em] text-white/65">2027 届校招情报台</p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">今天，别错过任何一家目标公司</h1>
              <p className="mt-2 text-sm leading-6 text-white/70">聚合 120 家名企官方校招入口，持续核验开放状态与截止时间。</p>
              <a href="#company-list" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4c49c9] shadow-lg">搜索 120 家公司 <span>↓</span></a>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[42px] border-white/10" />
            <div className="pointer-events-none absolute bottom-[-90px] right-40 h-44 w-44 rounded-full bg-[#7774f5]" />
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [String(companies.filter((company) => company.status === '开放').length), '家已核验开放', '官方来源'], ['1', '项正在预热', '持续跟进'], [String(companies.length), '家名企持续追踪', '五大热门行业'],
            ].map(([value, label, meta], index) => (
              <div key={label} className="rounded-2xl border border-[#e9ebef] bg-white p-5 shadow-[0_5px_18px_rgba(31,38,51,.035)]">
                <div className="flex items-end justify-between gap-3">
                  <strong className={`text-3xl tracking-tight ${index === 1 ? 'text-[#ef795f]' : 'text-[#272e3b]'}`}>{value}</strong>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${index === 1 ? 'bg-[#fff2ee] text-[#e3654b]' : 'bg-[#f1f2f5] text-[#737b8c]'}`}>{meta}</span>
                </div>
                <p className="mt-2 text-sm text-[#777f8e]">{label}</p>
              </div>
            ))}
          </section>

          <CompanyExplorer companies={companies} signedIn={Boolean(user)} signInHref={chatGPTSignInPath('/')} />
        </div>
      </div>
    </main>
  );
}
