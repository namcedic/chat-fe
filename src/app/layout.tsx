import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import '@styles/index.scss';
import { Toaster } from 'react-hot-toast';

import { ReactQueryProvider } from '@root/providers/ReactQueryProvider';
import { ReduxProvider } from '@root/providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FE Base Project',
  description: 'Base project with Next.js 15, TypeScript, Tailwind, Ant Design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
              },
            }}
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </ReduxProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
