import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '秋招雷达｜2027届校招投递情报台',
  description: '聚合120家名企官方校招入口，追踪开放状态，管理个人投递进度。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
