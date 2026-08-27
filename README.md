# 秋招雷达（Job Radar）

面向 2027 届应届生的个人秋招作战桌面：集中查看名企官方校招入口，记录投递进度，并持续推进笔试与面试流程。

[访问线上版本](https://qiuzhao-radar-2027.zehao0204.chatgpt.site)（当前为私人站点，需要使用站点所有者账号登录）

![秋招雷达](./public/og.png)

## 项目简介

秋招信息分散在公司官网、招聘公众号和第三方招聘系统中，很难持续确认哪些公司已经开放投递，也容易忘记自己的投递进度。

秋招雷达将这两件事收拢到一个界面：

- 收录 121 家知名企业，覆盖互联网、汽车、芯片、制造业和咨询五个行业；
- 提供公司官方招聘入口、27 届招聘状态、批次和核验时间；
- 支持按行业、公司名称和招聘状态筛选；
- 支持记录岗位、投递日期、工作地点、下一步时间和备注；
- 使用航线看板推进“准备投递 → 已投递 → 笔试/测评 → 面试 → Offer”；
- 支持将不再推进的记录标记为“已终止”。

## 招聘状态说明

| 状态 | 判断标准 |
| --- | --- |
| 开放 | 已找到明确的 2027 届招聘公告、官网职位或官方招聘信息 |
| 预热 | 官方已发布预告，但正式岗位尚未完全开放 |
| 待核验 | 暂未找到足够可靠的公开证据，不代表尚未开放 |

招聘状态目前由人工结合官方招聘站、企业招聘账号、官方 ATS 页面及高校转载的企业公告进行核验。链接检测脚本只能判断页面是否可访问，不能单独作为“已开放”或“未开放”的依据。

## 技术栈

- Next.js 16、React 19、TypeScript
- Vinext、Vite、Tailwind CSS
- Cloudflare Workers 与 D1
- Drizzle ORM
- OpenAI Sites 托管与 ChatGPT 身份认证

## 本地运行

环境要求：Node.js 22.13 或更高版本。

```bash
git clone https://github.com/zehao0204-png/Job-Radar.git
cd Job-Radar
npm install
npm run dev
```

常用命令：

```bash
npm run dev       # 启动本地开发环境
npm run build     # 构建生产版本
npm run lint      # 运行代码检查
npm run db:generate # 生成数据库迁移
```

ChatGPT 登录信息和 D1 数据库绑定由 OpenAI Sites 运行环境提供。脱离该环境本地运行时，登录与持久化功能需要自行配置兼容的请求头和 Cloudflare D1 绑定。

## 企业数据维护

企业目录维护在 `data/companies.ts`。每家公司包含：

- 唯一 ID 和公司名称；
- 所属行业；
- 官方招聘入口；
- 招聘状态与招聘批次；
- 截止时间和最后核验日期；
- 首次确认开放日期（用于“今日新开”模块）。

可以运行以下命令批量检查招聘入口的网络可达性：

```bash
node scripts/audit-company-links.mjs
```

输出 JSON 明细：

```bash
node scripts/audit-company-links.mjs --json
```

部分招聘网站存在动态渲染、访问频率限制或反爬保护，因此出现 `protected` 或 `network-error` 不一定表示入口失效，仍需人工打开核验。

## 项目结构

```text
app/
  api/applications/       投递记录接口
  applications/          投递航线页面
  company-explorer.tsx   公司目录、搜索与筛选
  desk-shell.tsx         主界面与页面切换
data/companies.ts        企业入口和招聘状态数据
db/                      D1 数据模型与初始化逻辑
drizzle/                 数据库迁移
scripts/                 企业链接校验脚本
public/                  图标与分享预览图
```

## 数据与隐私

- 投递记录保存在 D1 数据库中，不会同步到招聘企业；
- 每条记录都关联当前 ChatGPT 用户 ID，接口读写时按用户隔离；
- 当前线上站点仅向站点所有者开放；
- 企业招聘状态来自公开信息，仅用于求职信息整理，实际批次与截止时间以企业官方页面为准。

## 后续计划

- 每日自动扫描企业入口，生成状态变化待审核清单；
- 在人工确认后发布招聘状态更新；
- 增加状态变化记录和证据来源展示；
- 完善链接失效告警和数据维护流程。
