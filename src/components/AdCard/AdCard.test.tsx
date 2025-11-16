import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AdCard from './AdCard';
import type { Advertisement } from '../../types';

const mockAd: Advertisement = {
  id: 1,
  title: 'Телефон iPhone',
  description: 'Хорошее состояние',
  price: 50000,
  category: 'Электроника',
  categoryId: 1,
  status: 'pending',
  priority: 'urgent',
  createdAt: '2025-11-14T10:00:00Z',
  updatedAt: '2025-11-14T10:00:00Z',
  images: ['https://via.placeholder.com/150'],
  seller: {
    id: 1,
    name: 'Иван',
    rating: '4.8',
    totalAds: 10,
    registeredAt: '2024-01-01T12:00:00Z',
  },
  characteristics: { Цвет: 'Черный' },
  moderationHistory: [],
};

describe('AdCard', () => {
  it('рендерит заголовок, цену и статус', () => {
    render(
      <MemoryRouter>
        <AdCard ad={mockAd} />
      </MemoryRouter>
    );
    expect(screen.getByText('Телефон iPhone')).toBeInTheDocument();
    expect(screen.getByText(/50\s000\s₽/)).toBeInTheDocument();
    expect(screen.getByText('На модерации')).toBeInTheDocument();
    expect(screen.getByText('Срочный')).toBeInTheDocument();
  });

  it('отображает изображение', () => {
    render(
      <MemoryRouter>
        <AdCard ad={mockAd} />
      </MemoryRouter>
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
  });
});
