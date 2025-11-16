import {
  formatPrice,
  formatDate,
  formatDateTime,
  getStatusText,
  getStatusColor,
  getPriorityText,
  getPriorityColor,
  buildQueryString,
  parseQueryString,
} from './helpers';

describe('formatPrice', () => {
  it('форматирует целое число в рубли', () => {
    expect(formatPrice(1500)).toMatch(/1\s500\s₽/);
  });

  it('форматирует ноль', () => {
    expect(formatPrice(0)).toMatch(/0\s₽/);
  });

  it('форматирует большие числа', () => {
    expect(formatPrice(1000000)).toMatch(/1\s000\s000\s₽/);
  });
});

describe('formatDate', () => {
  it('форматирует дату в формат ДД.ММ.ГГГГ', () => {
    const date = '2025-11-14T10:00:00Z';
    expect(formatDate(date)).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});

describe('formatDateTime', () => {
  it('форматирует дату и время', () => {
    const date = '2025-11-14T10:30:00Z';
    expect(formatDateTime(date)).toMatch(/\d{2}\.\d{2}\.\d{4},\s\d{2}:\d{2}/);
  });
});

describe('getStatusText', () => {
  it('возвращает текст для статуса pending', () => {
    expect(getStatusText('pending')).toBe('На модерации');
  });

  it('возвращает текст для статуса approved', () => {
    expect(getStatusText('approved')).toBe('Одобрено');
  });

  it('возвращает текст для статуса rejected', () => {
    expect(getStatusText('rejected')).toBe('Отклонено');
  });

  it('возвращает текст для статуса draft', () => {
    expect(getStatusText('draft')).toBe('Черновик');
  });
});

describe('getStatusColor', () => {
  it('возвращает processing для pending', () => {
    expect(getStatusColor('pending')).toBe('processing');
  });

  it('возвращает success для approved', () => {
    expect(getStatusColor('approved')).toBe('success');
  });

  it('возвращает error для rejected', () => {
    expect(getStatusColor('rejected')).toBe('error');
  });

  it('возвращает default для draft', () => {
    expect(getStatusColor('draft')).toBe('default');
  });
});

describe('getPriorityText', () => {
  it('возвращает текст для normal', () => {
    expect(getPriorityText('normal')).toBe('Обычный');
  });

  it('возвращает текст для urgent', () => {
    expect(getPriorityText('urgent')).toBe('Срочный');
  });
});

describe('getPriorityColor', () => {
  it('возвращает error для urgent', () => {
    expect(getPriorityColor('urgent')).toBe('error');
  });

  it('возвращает default для normal', () => {
    expect(getPriorityColor('normal')).toBe('default');
  });
});

describe('buildQueryString', () => {
  it('строит query string из объекта', () => {
    const params = { page: 1, limit: 10, search: 'test' };
    const result = buildQueryString(params);
    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
    expect(result).toContain('search=test');
  });

  it('пропускает undefined значения', () => {
    const params = { page: 1, search: undefined };
    const result = buildQueryString(params);
    expect(result).toContain('page=1');
    expect(result).not.toContain('search');
  });

  it('обрабатывает массивы', () => {
    const params = { status: ['pending', 'approved'] };
    const result = buildQueryString(params);
    expect(result).toContain('status=pending');
    expect(result).toContain('status=approved');
  });

  it('пропускает пустые строки', () => {
    const params = { page: 1, search: '' };
    const result = buildQueryString(params);
    expect(result).not.toContain('search');
  });
});

describe('parseQueryString', () => {
  it('парсит простую query string', () => {
    const result = parseQueryString('page=1&limit=10');
    expect(result.page).toBe('1');
    expect(result.limit).toBe('10');
  });

  it('обрабатывает повторяющиеся параметры как массив', () => {
    const result = parseQueryString('status=pending&status=approved');
    expect(Array.isArray(result.status)).toBe(true);
    expect(result.status).toEqual(['pending', 'approved']);
  });

  it('возвращает пустой объект для пустой строки', () => {
    const result = parseQueryString('');
    expect(result).toEqual({});
  });
});
