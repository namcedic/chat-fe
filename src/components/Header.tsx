'use client';

import React from 'react';

import Image from '@root/components/image/img';

import CommonDropdown from './CommonDropdown';
import MainHeader from './MainHeader';

export default function Header() {
  const items = [
    { key: 'yahoo-auction', label: 'Yahoo! Auction', onClick: () => console.log('Yahoo') },
    { key: 'yahoo-shopping', label: 'Yahoo! Shopping' },
    { key: 'mercari', label: 'Mercari' },
    { key: 'rakuten', label: 'Rakuten' },
    { key: 'paypay', label: 'Paypay Fleamarket' },
    { key: 'surugaya', label: 'Surugaya' },
  ];

  return (
    <header className="client-header w-full py-4 shadow-md">
      <div className="container">
        <div className="header-above flex hidden w-full justify-between xl:flex">
          <div className="header-above-left">
            <CommonDropdown title="Sản phẩm trên Janzone" items={items} />
          </div>
          <div className="header-above-right flex gap-5">
            <div className=""> Người dùng lần đầu </div>
            <div className=""> Hỗ trợ </div>
            <div className=""> Đăng nhập / Đăng kí</div>
          </div>
        </div>
        <div className="header-below flex items-center justify-between"></div>
      </div>
      <div className="container">
        <Image src="/static/logo.svg" alt="logo" width={150} height={50} />
        <div className="form-search-main">
          <MainHeader />
        </div>
        <div className="icon"></div>
      </div>
    </header>
  );
}
