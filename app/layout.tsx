import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://qiuzhao-radar-2027.zehao0204.chatgpt.site'),
  title: '秋招雷达｜我的2027届秋招工作台',
  description: '我的个人秋招工作台：查找120家名企官方入口，记录和推进投递进度。',
  openGraph: {
    title: '秋招雷达｜我的2027届秋招工作台',
    description: '我的个人秋招工作台：查找120家名企官方入口，记录和推进投递进度。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '秋招雷达' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '秋招雷达｜我的2027届秋招工作台',
    description: '我的个人秋招工作台：查找120家名企官方入口，记录和推进投递进度。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
