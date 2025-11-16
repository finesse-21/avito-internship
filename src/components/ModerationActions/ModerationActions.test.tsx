import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModerationActions from './ModerationActions';

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('ModerationActions', () => {
  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();
  const mockOnRequestChanges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит все кнопки действий', () => {
    render(
      <ModerationActions
        adId={1}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onRequestChanges={mockOnRequestChanges}
      />
    );

    expect(screen.getByText('Одобрить')).toBeInTheDocument();
    expect(screen.getByText('Отклонить')).toBeInTheDocument();
    expect(screen.getByText('Запросить изменения')).toBeInTheDocument();
  });

  it('вызывает onApprove при нажатии на кнопку Одобрить', async () => {
    mockOnApprove.mockResolvedValue(undefined);

    render(
      <ModerationActions
        adId={1}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onRequestChanges={mockOnRequestChanges}
      />
    );

    fireEvent.click(screen.getByText('Одобрить'));

    await waitFor(() => {
      expect(mockOnApprove).toHaveBeenCalledTimes(1);
    });
  });

  it('блокирует кнопки когда disabled=true', () => {
    render(
      <ModerationActions
        adId={1}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        onRequestChanges={mockOnRequestChanges}
        disabled={true}
      />
    );

    expect(screen.getByText('Одобрить').closest('button')).toBeDisabled();
    expect(screen.getByText('Отклонить').closest('button')).toBeDisabled();
    expect(
      screen.getByText('Запросить изменения').closest('button')
    ).toBeDisabled();
  });
});
