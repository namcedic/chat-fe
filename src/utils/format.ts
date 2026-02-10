import dayjs from 'dayjs';

// Date formatting
export const formatDate = (date: string | Date, format = 'DD/MM/YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

// Number formatting
export const formatCurrency = (amount: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};
