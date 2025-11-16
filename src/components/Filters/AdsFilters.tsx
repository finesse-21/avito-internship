import { Form, Select, Input, Button, Row, Col, InputNumber } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { AdsFilters } from '../../types';

interface AdsFiltersProps {
  filters: AdsFilters;
  onFiltersChange: (filters: AdsFilters) => void;
  categories: { id: number; name: string }[];
}

const statusOptions = [
  { label: 'На модерации', value: 'pending' },
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' },
  { label: 'Черновик', value: 'draft' },
];

const sortByOptions = [
  { label: 'По дате создания', value: 'createdAt' },
  { label: 'По цене', value: 'price' },
  { label: 'По приоритету', value: 'priority' },
];

const sortOrderOptions = [
  { label: 'По возрастанию', value: 'asc' },
  { label: 'По убыванию', value: 'desc' },
];

const AdsFiltersComponent = ({
  filters,
  onFiltersChange,
  categories,
}: AdsFiltersProps) => {
  const [form] = Form.useForm();

  const handleValuesChange = (
    _: Partial<AdsFilters>,
    allValues: AdsFilters
  ) => {
    onFiltersChange({
      ...filters,
      ...allValues,
      page: 1,
    });
  };

  const handleReset = () => {
    form.resetFields();
    onFiltersChange({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={filters}
      onValuesChange={handleValuesChange}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="search" label="Поиск">
            <Input
              placeholder="Название объявления"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status" label="Статус">
            <Select
              mode="multiple"
              placeholder="Выберите статус"
              options={statusOptions}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="categoryId" label="Категория">
            <Select
              placeholder="Выберите категорию"
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="minPrice" label="Цена от">
            <InputNumber
              placeholder="Минимальная цена"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="maxPrice" label="Цена до">
            <InputNumber
              placeholder="Максимальная цена"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="sortBy" label="Сортировать по">
            <Select options={sortByOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="sortOrder" label="Порядок">
            <Select options={sortOrderOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label=" ">
            <Button icon={<ClearOutlined />} onClick={handleReset} block>
              Сбросить фильтры
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AdsFiltersComponent;
