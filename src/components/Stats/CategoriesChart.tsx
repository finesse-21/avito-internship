import { Card } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CategoriesChartProps {
  data: Record<string, number>;
}

const CategoriesChart = ({ data }: CategoriesChartProps) => {
  const chartData = Object.entries(data).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <Card title="Распределение по категориям">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoriesChart;
