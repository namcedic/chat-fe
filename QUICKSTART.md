# Quick Start Guide

## 🚀 Bắt đầu nhanh

### 1. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 2. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### 3. Cấu hình môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Chỉnh sửa các biến môi trường theo nhu cầu.

## 📝 Các lệnh thường dùng

```bash
# Development
npm run dev              # Chạy dev server
npm run build            # Build production
npm run start            # Chạy production server

# Code Quality
npm run lint             # Kiểm tra lỗi ESLint
npm run lint:fix          # Tự động sửa lỗi ESLint
npm run format            # Format code với Prettier
npm run format:check      # Kiểm tra format
npm run type-check        # Kiểm tra TypeScript
```

## 📁 Cấu trúc thư mục

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global CSS
│   ├── error.tsx       # Error boundary
│   ├── loading.tsx     # Loading UI
│   └── not-found.tsx   # 404 page
├── components/          # React components
│   └── common/         # Common components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
├── constants/          # App constants
├── apis/               # API functions
├── providers/          # React providers
└── styles/             # SCSS styles
    ├── globals.scss
    ├── variables.scss
    └── mixins.scss
```

## 🎨 Sử dụng Tailwind CSS

```tsx
<div className="flex items-center justify-center p-4">
  <h1 className="text-2xl font-bold text-blue-500">Hello World</h1>
</div>
```

## 🎯 Sử dụng Ant Design

```tsx
import { Button, Card } from 'antd';

export default function MyComponent() {
  return (
    <Card>
      <Button type="primary">Click me</Button>
    </Card>
  );
}
```

## 🔌 Sử dụng React Query

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { exampleApi } from '@/apis/example';

export default function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['example'],
    queryFn: () => exampleApi.getData(),
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

## 📝 Sử dụng React Hook Form + Zod

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/common';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <Input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 🔐 Git Hooks

Husky đã được cấu hình để tự động:

- Chạy ESLint và Prettier trước khi commit
- Đảm bảo code quality

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Documentation](https://ant.design/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
