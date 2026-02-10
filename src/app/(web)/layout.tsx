import React from 'react';

import ChatWidget from '@root/components/ChatWidget';
import Footer from '@root/components/Footer';
import Header from '@root/components/Header';

export default function WebLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <ChatWidget />
      <Footer />
    </>
  );
}
