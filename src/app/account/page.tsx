'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppSelector } from '@root/hooks';

export default function AccountHomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Trang Tài Khoản</h1>
      {/* Thêm nội dung quản lý data ở đây sau */}
    </div>
  );
}
