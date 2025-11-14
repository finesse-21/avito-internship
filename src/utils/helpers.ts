import type { AdStatus, AdPriority } from '../types';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusText = (status: AdStatus): string => {
  const statusMap: Record<AdStatus, string> = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    draft: 'Черновик',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (
  status: AdStatus
): 'processing' | 'success' | 'error' | 'default' => {
  const colorMap: Record<
    AdStatus,
    'processing' | 'success' | 'error' | 'default'
  > = {
    pending: 'processing',
    approved: 'success',
    rejected: 'error',
    draft: 'default',
  };
  return colorMap[status] || 'default';
};

export const getPriorityText = (priority: AdPriority): string => {
  const priorityMap: Record<AdPriority, string> = {
    normal: 'Обычный',
    urgent: 'Срочный',
  };
  return priorityMap[priority] || priority;
};

export const getPriorityColor = (priority: AdPriority): 'default' | 'error' => {
  return priority === 'urgent' ? 'error' : 'default';
};

// Формирование URL с query параметрами
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

// Парсинг query параметров
export const parseQueryString = (
  search: string
): Record<string, string | string[]> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value);
      } else {
        result[key] = [result[key] as string, value];
      }
    } else {
      result[key] = value;
    }
  });

  return result;
};
