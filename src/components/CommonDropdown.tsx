'use client';

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import React, { ReactNode } from 'react';

export interface CommonDropdownItem {
  key: string;
  label: ReactNode;
  onClick?: () => void;
}

interface CommonDropdownProps {
  /** Tiêu đề hiển thị bên ngoài */
  title: ReactNode;
  /** Danh sách item */
  items: CommonDropdownItem[];
  /** ClassName tuỳ chọn cho trigger */
  className?: string;
}

export default function CommonDropdown({ title, items, className }: CommonDropdownProps) {
  const menuItems: MenuProps['items'] = items.map(({ key, label, onClick }) => ({
    key,
    label,
    onClick,
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <span className={`cursor-pointer select-none ${className ?? ''}`}>
        <Space>
          {title}
          <DownOutlined />
        </Space>
      </span>
    </Dropdown>
  );
}
