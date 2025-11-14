import { Timeline, Tag } from 'antd';
import type { ModerationHistory as ModerationHistoryType } from '../../types';
import { formatDateTime } from '../../utils/helpers';

interface ModerationHistoryProps {
  history: ModerationHistoryType[];
}

const getActionColor = (action: string) => {
  const colorMap: Record<string, string> = {
    approved: 'green',
    rejected: 'red',
    requestChanges: 'orange',
  };
  return colorMap[action] || 'default';
};

const getActionText = (action: string) => {
  const textMap: Record<string, string> = {
    approved: 'Одобрено',
    rejected: 'Отклонено',
    requestChanges: 'Запрошены изменения',
  };
  return textMap[action] || action;
};

const ModerationHistory = ({ history }: ModerationHistoryProps) => {
  if (history.length === 0) {
    return <div style={{ color: '#888' }}>История модерации пуста</div>;
  }

  const timelineItems = history.map((item) => ({
    children: (
      <div>
        <div style={{ marginBottom: 8 }}>
          <Tag color={getActionColor(item.action)}>
            {getActionText(item.action)}
          </Tag>
        </div>
        <div style={{ marginBottom: 4 }}>
          <strong>Модератор:</strong> {item.moderatorName}
        </div>
        <div style={{ marginBottom: 4, fontSize: '12px', color: '#888' }}>
          {formatDateTime(item.timestamp)}
        </div>
        {item.reason && (
          <div style={{ marginBottom: 4 }}>
            <strong>Причина:</strong> {item.reason}
          </div>
        )}
        {item.comment && (
          <div style={{ marginBottom: 4 }}>
            <strong>Комментарий:</strong> {item.comment}
          </div>
        )}
      </div>
    ),
  }));

  return <Timeline items={timelineItems} />;
};

export default ModerationHistory;
