'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@root/hooks';
import { loginRequest } from '@root/store/auth/authSlice';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = (values: { username: string; password: string }) => {
    dispatch(loginRequest(values));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Title level={2}>Đăng nhập</Title>
          <Text type="secondary">Vui lòng đăng nhập vào tài khoản của bạn</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="Username / Email / Phone"
            rules={[{ required: true, message: 'Vui lòng nhập username/email/phone!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username / Email / Phone" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-center">
          <Text type="secondary">
            Chưa có tài khoản?{' '}
            <Button type="link" className="p-0" onClick={() => router.push('/register')}>
              Đăng ký ngay
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
}
