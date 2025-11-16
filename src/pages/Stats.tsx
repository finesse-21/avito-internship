import { useState, useEffect } from 'react';
import { Typography, Select, Space, Spin, Alert, Row, Col } from 'antd';
import StatsCards from '../components/Stats/StatsCards';
import ActivityChart from '../components/Stats/ActivityChart';
import DecisionsChart from '../components/Stats/DecisionsChart';
import CategoriesChart from '../components/Stats/CategoriesChart';
import { statsApi } from '../services/api';
import type {
  StatsSummary,
  ActivityData,
  DecisionsData,
  StatsPeriod,
} from '../types';

const { Title } = Typography;

const Stats = () => {
  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [decisionsData, setDecisionsData] = useState<DecisionsData | null>(
    null
  );
  const [categoriesData, setCategoriesData] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, activityRes, decisionsRes, categoriesRes] =
        await Promise.all([
          statsApi.getSummary({ period }),
          statsApi.getActivityChart({ period }),
          statsApi.getDecisionsChart({ period }),
          statsApi.getCategoriesChart({ period }),
        ]);

      setSummary(summaryRes);
      setActivityData(activityRes);
      setDecisionsData(decisionsRes);
      setCategoriesData(categoriesRes);
    } catch (err) {
      setError('Ошибка при загрузке статистики');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Последние 7 дней', value: 'week' },
    { label: 'Последние 30 дней', value: 'month' },
  ];

  if (loading && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2}>Статистика модератора</Title>
        <Space>
          <span>Период:</span>
          <Select
            value={period}
            onChange={setPeriod}
            options={periodOptions}
            style={{ width: 200 }}
          />
        </Space>
      </div>

      {error && (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {summary && (
        <>
          <StatsCards stats={summary} period={period} />

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <ActivityChart data={activityData} />
            </Col>
            <Col xs={24} lg={12}>
              {decisionsData && <DecisionsChart data={decisionsData} />}
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <CategoriesChart data={categoriesData} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Stats;
