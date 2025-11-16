import { Card } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ActivityData } from '../../types';

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart = ({ data }: ActivityChartProps) => {
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    }),
    Одобрено: item.approved,
    Отклонено: item.rejected,
    'На доработку': item.requestChanges,
  }));

  return (
    <Card title="Активность по дням">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Одобрено" fill="#52c41a" />
          <Bar dataKey="Отклонено" fill="#ff4d4f" />
          <Bar dataKey="На доработку" fill="#faad14" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ActivityChart;
