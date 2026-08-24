import { and, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { applications } from '../../../db/schema';
import { ensureSchema, getDb } from '../../../db';
import { getChatGPTUser } from '../../chatgpt-auth';
import { companies } from '../../../data/companies';

const stages = ['准备投递', '已投递', '笔试/测评', '一面', '二面', '终面/HR面', 'Offer', '已终止'];

async function authorizedDb() {
  const user = await getChatGPTUser();
  if (!user) return null;
  await ensureSchema();
  return { db: getDb(), user };
}

export async function GET() {
  const context = await authorizedDb();
  if (!context) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const rows = await context.db.select().from(applications).where(eq(applications.userId, context.user.userId)).orderBy(desc(applications.updatedAt));
  return NextResponse.json(rows.map((row) => row.stage === '已结束' ? { ...row, stage: '已终止' } : row));
}

export async function POST(request: Request) {
  const context = await authorizedDb();
  if (!context) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const body = await request.json() as Record<string, string>;
  const company = companies.find((item) => item.id === body.companyId);
  if (!company || !body.position?.trim() || !stages.includes(body.stage)) {
    return NextResponse.json({ error: '请填写有效的公司、岗位和阶段' }, { status: 400 });
  }
  const now = new Date().toISOString();
  const row = {
    id: crypto.randomUUID(), userId: context.user.userId, companyId: company.id, companyName: company.name,
    position: body.position.trim().slice(0, 80), location: (body.location ?? '').trim().slice(0, 40),
    appliedAt: body.appliedAt || now.slice(0, 10), stage: body.stage, nextAt: body.nextAt || '',
    notes: (body.notes ?? '').trim().slice(0, 500), createdAt: now, updatedAt: now,
  };
  await context.db.insert(applications).values(row);
  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(request: Request) {
  const context = await authorizedDb();
  if (!context) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const body = await request.json() as Record<string, string>;
  if (!body.id || !stages.includes(body.stage)) return NextResponse.json({ error: '无效阶段' }, { status: 400 });
  const result = await context.db.update(applications).set({ stage: body.stage, updatedAt: new Date().toISOString() }).where(and(eq(applications.id, body.id), eq(applications.userId, context.user.userId))).returning();
  if (!result.length) return NextResponse.json({ error: '记录不存在' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
  const context = await authorizedDb();
  if (!context) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少记录ID' }, { status: 400 });
  await context.db.delete(applications).where(and(eq(applications.id, id), eq(applications.userId, context.user.userId)));
  return NextResponse.json({ ok: true });
}
