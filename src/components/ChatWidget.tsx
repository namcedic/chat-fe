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
  text: string;
  senderType: 'CUSTOMER' | 'AGENT';
  senderName?: string;
  createdAt: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    conversationId: '',
    customerToken: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check localStorage for existing session
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
      initSocket(savedId, savedToken);
    }
  }, []);

  const initSocket = (id: string, token: string) => {
    if (socketRef.current) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { conversationId: id, customerToken: token },
    });

    socketRef.current.on('message:new', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Rejoin room if needed
    socketRef.current.emit('customer:resume', { conversationId: id, customerToken: token });
  };

  const handleStartChat = async (values: { name: string; phone: string; message: string }) => {
    setLoading(true);
    try {
      // In a real scenario, we connect first then emit
      const socket = io(SOCKET_URL, { transports: ['websocket'] });
      socketRef.current = socket;

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

            setMessages([
              {
                text: values.message,
                senderType: 'CUSTOMER',
                createdAt: new Date().toISOString(),
              },
            ]);

            setIsStarted(true);
            initSocket(response.conversationId, response.customerToken);
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

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        text: inputValue.trim(),
        senderType: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      },
    ]);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
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

      {/* Chat Window */}
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
            /* Start Form */
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
            /* Chat Interface */
            <div className="flex h-full flex-col bg-gray-50">
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
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

              {/* Input Area */}
              <div className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleSendMessage}
                  variant="borderless"
                  className="flex-1 focus:ring-0"
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0 bg-blue-600"
                />
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
