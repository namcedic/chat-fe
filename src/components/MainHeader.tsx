'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import '@styles/main-header.scss';

type MarketKey = 'jan_hub' | 'yahoo_auction' | 'yahoo_shopping' | 'mercari' | 'rakuten' | 'paypay';

type MarketItem = {
  key: MarketKey;
  label: string;
  icon: React.ReactNode;
};

type TopSearchMap = Record<MarketKey, string[]>;

const MARKET_ITEMS: MarketItem[] = [
  {
    key: 'jan_hub',
    label: 'Jan Hub',
    icon: <span className="mh-icon mh-icon-hub">⬢</span>,
  },
  {
    key: 'yahoo_auction',
    label: 'Y! Auction',
    icon: <span className="mh-icon mh-icon-auction">🛠️</span>,
  },
  {
    key: 'yahoo_shopping',
    label: 'Y! Shopping',
    icon: <span className="mh-icon mh-icon-shopping">🛒</span>,
  },
  {
    key: 'rakuten',
    label: 'Rakuten JP',
    icon: <span className="mh-icon mh-icon-rakuten">R</span>,
  },
  {
    key: 'mercari',
    label: 'Mercari JP',
    icon: <span className="mh-icon mh-icon-mercari">M</span>,
  },
  {
    key: 'paypay',
    label: 'Paypay',
    icon: <span className="mh-icon mh-icon-paypay">P</span>,
  },
];

const TOP_SEARCH: TopSearchMap = {
  jan_hub: ['Đồng hồ lô', 'zippo', 'ps4', 'macbook'],
  yahoo_auction: ['Đồng hồ lô', 'trang sức lô', 'zippo', 'synology', 'jazz', 'bose'],
  mercari: ['ポケモンフィギュア', 'trang sức lô', 'j4125', 'vantrue', 'b-daman'],
  yahoo_shopping: ['đồng hồ lô', 'xe đạp', 'imac', 'seiko', 'ipad', 'bianchi'],
  rakuten: ['zippo', 'iphone', 'đồng hồ lô', 'xe đạp', 'imac', 'clio blue', 'ipad'],
  paypay: ['bánh xe đạp', 'pg ガンダム', 'maxell 35', 'ps4 điều khiển', 'toto シャワー'],
};

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);

  return ref;
}

export default function MainHeader() {
  const [market, setMarket] = useState<MarketKey>('jan_hub');
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  const [q, setQ] = useState('');
  const [translate, setTranslate] = useState(true);

  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  const marketLabel = useMemo(
    () => MARKET_ITEMS.find((m) => m.key === market)?.label ?? 'Jan Hub',
    [market]
  );

  const marketDropdownRef = useClickOutside<HTMLDivElement>(() => setIsMarketOpen(false));
  const suggestRef = useClickOutside<HTMLDivElement>(() => setIsSuggestOpen(false));

  const onSubmit = () => {
    // TODO: bạn thay bằng router push / search action
    console.log('SEARCH', { market, q, translate });
    setIsSuggestOpen(false);
  };

  // show suggest only when there is input value
  const handleFocusInput = () => {
    if (q) setIsSuggestOpen(true);
  };

  return (
    <header className="mh">
      <div className="mh-bar">
        <div className="mh-container">
          {/* LEFT: Brand */}
          <div className="mh-left">
            <Link className="mh-brand" href="/">
              <span className="mh-brand__logo">⬢</span>
              <span className="mh-brand__name">Janzone</span>
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="mh-center">
            {/* Market dropdown */}
            <div className="mh-market" ref={marketDropdownRef}>
              <button
                type="button"
                className={`mh-market__btn ${isMarketOpen ? 'is-open' : ''}`}
                onClick={() => setIsMarketOpen((v) => !v)}
              >
                <span className="mh-market__badge">
                  <span className="mh-market__badgeDot" />
                </span>
                <span className="mh-market__text">{marketLabel}</span>
                <span className="mh-caret">▾</span>
              </button>

              {isMarketOpen && (
                <div className="mh-market__menu">
                  <div className="mh-market__menuList">
                    {MARKET_ITEMS.map((it) => (
                      <button
                        key={it.key}
                        type="button"
                        className={`mh-market__item ${it.key === market ? 'is-active' : ''}`}
                        onClick={() => {
                          setMarket(it.key);
                          setIsMarketOpen(false);
                        }}
                      >
                        <span className="mh-market__itemIcon">{it.icon}</span>
                        <span className="mh-market__itemText">{it.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search box */}
            <div className="mh-search" ref={suggestRef}>
              <div className="mh-search__box">
                <span className="mh-search__glass">⌕</span>

                <input
                  className="mh-search__input"
                  placeholder="Nhập từ khoá hoặc link..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={handleFocusInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSubmit();
                    if (e.key === 'Escape') setIsSuggestOpen(false);
                  }}
                />

                <label className="mh-search__translate">
                  <input
                    type="checkbox"
                    checked={translate}
                    onChange={(e) => setTranslate(e.target.checked)}
                  />
                  <span>Dịch từ khóa</span>
                </label>

                <button type="button" className="mh-search__btn" onClick={onSubmit}>
                  <span className="mh-search__btnIcon">⌕</span>
                </button>
              </div>

              {/* Mega suggest panel */}
              {isSuggestOpen && (
                <div className="mh-suggest">
                  <div className="mh-suggest__head">
                    <div className="mh-suggest__title">Top tìm kiếm</div>
                    <button
                      type="button"
                      className="mh-suggest__close"
                      onClick={() => setIsSuggestOpen(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mh-suggest__body">
                    <div className="mh-suggest__rows">
                      {MARKET_ITEMS.map((it) => (
                        <div key={it.key} className="mh-suggest__row">
                          <div className="mh-suggest__left">
                            <div className="mh-suggest__market">
                              <span className="mh-suggest__marketIcon">{it.icon}</span>
                              <span className="mh-suggest__marketLabel">{it.label}</span>
                            </div>
                          </div>

                          <div className="mh-suggest__right">
                            {(TOP_SEARCH[it.key] || []).map((kw) => (
                              <button
                                key={kw}
                                type="button"
                                className="mh-chip"
                                onClick={() => {
                                  setMarket(it.key);
                                  setQ(kw);
                                  onSubmit();
                                }}
                              >
                                {kw}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Optional: mũi tên nhỏ phía trên */}
                    <div className="mh-suggest__arrow" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="mh-right">
            <a className="mh-action" href="/auction">
              <span className="mh-action__icon">🏷️</span>
              <span className="mh-action__label">Đấu giá</span>
            </a>
            <a className="mh-action" href="/cart">
              <span className="mh-action__icon">🛒</span>
              <span className="mh-action__label">Giỏ hàng</span>
            </a>
            <a className="mh-action" href="/notifications">
              <span className="mh-action__icon">🔔</span>
              <span className="mh-action__label">Thông báo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
