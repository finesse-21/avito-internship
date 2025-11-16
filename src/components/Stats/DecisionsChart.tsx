import { Card } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DecisionsData } from '../../types';

interface DecisionsChartProps {
  data: DecisionsData;
}

const COLORS = ['#52c41a', '#ff4d4f', '#faad14'];

const DecisionsChart = ({ data }: DecisionsChartProps) => {
  const chartData = [
    { name: 'Одобрено', value: data.approved },
    { name: 'Отклонено', value: data.rejected },
    { name: 'На доработку', value: data.requestChanges },
  ];

  return (
    <Card title="Распределение решений">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DecisionsChart;
