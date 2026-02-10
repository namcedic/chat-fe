'use client';

import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  UserOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { Input, Button, Card, Form, Avatar } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id?: string | number;
  text: string;
  senderType: 'CUSTOMER' | 'AGENT';
  senderName?: string;
  createdAt: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
// Chuẩn hóa API Base URL theo SERVICE_PREFIX = api/be
const API_BASE_URL = `${SOCKET_URL}/api/be`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    conversationId: '',
    customerToken: '',
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedId = localStorage.getItem('chat_conversationId');
    const savedToken = localStorage.getItem('chat_customerToken');
    const savedName = localStorage.getItem('chat_customerName');

    if (savedId && savedToken) {
      setCustomerInfo((prev) => ({
        ...prev,
        conversationId: savedId,
        customerToken: savedToken,
        name: savedName || '',
      }));
      setIsStarted(true);

      // 1. Load history via REST with Header Token
      fetch(`${API_BASE_URL}/cms/chat/client/conversations/${savedId}/messages`, {
        headers: {
          'x-customer-token': savedToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.items) {
            setMessages(data.items);
          }
        })
        .catch((err) => console.error('Failed to load history:', err));

      initSocket(savedId, savedToken);
    }
  }, []);

  const initSocket = (id: string, token: string) => {
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected, resuming room...');
      socket.emit('customer:resume', { conversationId: id, customerToken: token });
    });

    socket.on('message:new', (msg: Message) => {
      setMessages((prev) => {
        // Dedupe by id hoặc content + time
        const isDuplicate = prev.some(
          (m) =>
            (m.id && msg.id && m.id === msg.id) ||
            (m.text === msg.text &&
              m.senderType === msg.senderType &&
              Math.abs(dayjs(m.createdAt).diff(dayjs(msg.createdAt))) < 2000)
        );
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  };

  const handleStartChat = async (values: { name: string; phone: string; message: string }) => {
    setLoading(true);
    try {
      if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
      }
      const socket = socketRef.current;

      socket.emit(
        'customer:start',
        {
          name: values.name,
          phone: values.phone,
          message: values.message,
        },
        (response: { conversationId: string; customerToken: string }) => {
          if (response.conversationId) {
            localStorage.setItem('chat_conversationId', response.conversationId);
            localStorage.setItem('chat_customerToken', response.customerToken);
            localStorage.setItem('chat_customerName', values.name);

            setCustomerInfo({
              name: values.name,
              phone: values.phone,
              conversationId: response.conversationId,
              customerToken: response.customerToken,
            });

            setIsStarted(true);
            // Server sẽ emit message:new cho cả sender, nên không cần setMessages tay ở đây
          }
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Start chat error:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current) return;

    const msgData = {
      conversationId: customerInfo.conversationId,
      customerToken: customerInfo.customerToken,
      message: inputValue.trim(),
    };

    socketRef.current.emit('customer:message', msgData);
    // BE đã được sửa để emit-to-all, nên FE không cần optimistic update
    // Điều này giúp tránh việc nhân đôi tin nhắn khi đang debug contract
    setInputValue('');
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {!isOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined style={{ fontSize: '24px' }} />}
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center border-none bg-blue-600 shadow-lg hover:bg-blue-700"
        />
      )}

      {isOpen && (
        <Card
          className="flex h-[500px] w-[350px] flex-col overflow-hidden border-none shadow-2xl sm:w-[400px]"
          styles={{
            body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' },
          }}
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CustomerServiceOutlined className="text-blue-600" />
                <span>Hỗ trợ trực tuyến</span>
              </div>
              <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />
            </div>
          }
        >
          {!isStarted ? (
            <div className="flex-1 overflow-y-auto p-6">
              <p className="mb-6 text-center text-gray-500">
                Vui lòng để lại thông tin, chúng tôi sẽ hỗ trợ bạn ngay!
              </p>
              <Form layout="vertical" onFinish={handleStartChat}>
                <Form.Item
                  name="name"
                  label="Họ tên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input
                    placeholder="Nguyễn Văn A"
                    prefix={<UserOutlined className="text-gray-400" />}
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
                  ]}
                >
                  <Input placeholder="09xxxxxxxx" />
                </Form.Item>
                <Form.Item
                  name="message"
                  label="Tin nhắn"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                >
                  <Input.TextArea rows={3} placeholder="Tôi cần tư vấn về..." />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="mt-2 h-10 bg-blue-600"
                >
                  Bắt đầu Chat
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex h-full flex-col overflow-hidden bg-gray-50">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-2 ${msg.senderType === 'CUSTOMER' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar
                        size="small"
                        icon={
                          msg.senderType === 'CUSTOMER' ? (
                            <UserOutlined />
                          ) : (
                            <CustomerServiceOutlined />
                          )
                        }
                        className={msg.senderType === 'CUSTOMER' ? 'bg-blue-500' : 'bg-green-500'}
                      />
                      <div className="flex flex-col">
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            msg.senderType === 'CUSTOMER'
                              ? 'rounded-tr-none bg-blue-600 text-white'
                              : 'rounded-tl-none bg-white text-gray-800 shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="mt-1 text-[10px] text-gray-400">
                          {dayjs(msg.createdAt).format('HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    variant="borderless"
                    className="flex-1 focus:ring-0"
                  />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="flex flex-shrink-0 items-center justify-center bg-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
