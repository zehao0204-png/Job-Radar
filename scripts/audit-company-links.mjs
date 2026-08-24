import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../data/companies.ts', import.meta.url), 'utf8');
const companies = [...source.matchAll(/make\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/g)].map((match) => ({ id: match[1], name: match[2], industry: match[3], url: match[4] }));

async function audit(company) {
  const started = Date.now();
  try {
    const response = await fetch(company.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    const body = (await response.text()).slice(0, 200_000);
    const title = body.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
    return {
      ...company,
      status: response.status,
      finalUrl: response.url,
      result: response.ok ? 'reachable' : [401, 403, 418, 429].includes(response.status) ? 'protected' : 'failed',
      title,
      mentions2027: /2027|27届|2027届/.test(body),
      mentionsCampus: /校园|校招|应届|campus|graduate|university|student/i.test(body),
      ms: Date.now() - started,
    };
  } catch (error) {
    return { ...company, status: 0, finalUrl: '', result: 'network-error', title: '', mentions2027: false, mentionsCampus: false, ms: Date.now() - started, error: error instanceof Error ? error.message : String(error) };
  }
}

const results = [];
for (let index = 0; index < companies.length; index += 10) {
  results.push(...await Promise.all(companies.slice(index, index + 10).map(audit)));
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(results));
} else {
  const counts = Object.fromEntries(
    ['reachable', 'protected', 'failed', 'network-error'].map((result) => [
      result,
      results.filter((item) => item.result === result).length,
    ]),
  );
  console.log(JSON.stringify({
    checkedAt: new Date().toISOString(),
    total: results.length,
    counts,
    needsReview: results
      .filter((item) => item.result !== 'reachable')
      .map(({ name, url, status, result, error }) => ({ name, url, status, result, error })),
  }, null, 2));
}
