import { Row, Col, Card, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { StatsSummary } from '../../types';

interface StatsCardsProps {
  stats: StatsSummary;
  period: string;
}

const StatsCards = ({ stats, period }: StatsCardsProps) => {
  const getReviewedCount = () => {
    switch (period) {
      case 'today':
        return stats.totalReviewedToday;
      case 'week':
        return stats.totalReviewedThisWeek;
      case 'month':
        return stats.totalReviewedThisMonth;
      default:
        return stats.totalReviewed;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Проверено объявлений"
            value={getReviewedCount()}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Процент одобренных"
            value={stats.approvedPercentage}
            suffix="%"
            precision={1}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Процент отклоненных"
            value={stats.rejectedPercentage}
            suffix="%"
            precision={1}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Среднее время проверки"
            value={stats.averageReviewTime}
            suffix="сек"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
