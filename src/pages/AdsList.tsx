import { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Pagination, Spin, Alert, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';
import AdCard from '../components/AdCard/AdCard';
import AdsFiltersComponent from '../components/Filters/AdsFilters';
import { adsApi } from '../services/api';
import type { Advertisement, AdsFilters, AdStatus } from '../types';
import { parseQueryString } from '../utils/helpers';
import { useHotkeys } from '../hooks/useHotkeys';

const { Title } = Typography;

const AdsList = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<(() => void) | null>(null);

  const [filters, setFilters] = useState<AdsFilters>(() => {
    const params = parseQueryString(searchParams.toString());
    return {
      page: Number(params.page) || 1,
      limit: 10,
      sortBy:
        (params.sortBy as 'createdAt' | 'price' | 'priority') || 'createdAt',
      sortOrder: (params.sortOrder as 'asc' | 'desc') || 'desc',
      status: params.status
        ? Array.isArray(params.status)
          ? (params.status as AdStatus[])
          : [params.status as AdStatus]
        : undefined,
      categoryId: params.categoryId ? Number(params.categoryId) : undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      search: params.search as string,
    };
  });

  const categories = [
    { id: 0, name: 'Электроника' },
    { id: 1, name: 'Недвижимость' },
    { id: 2, name: 'Транспорт' },
    { id: 3, name: 'Работа' },
    { id: 4, name: 'Услуги' },
    { id: 5, name: 'Животные' },
    { id: 6, name: 'Мода' },
    { id: 7, name: 'Детское' },
  ];

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adsApi.getAds(filters);
      setAds(response.ads);
      setTotalItems(response.pagination.totalItems);
    } catch (err) {
      setError('Ошибка при загрузке объявлений');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else {
          params[key] = String(value);
        }
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFiltersChange = (newFilters: AdsFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useHotkeys(
    {
      '/': () => {
        if (searchInputRef.current) {
          searchInputRef.current();
        }
      },
    },
    !loading
  );

  return (
    <div>
      <Title level={2}>Список объявлений</Title>

      <AdsFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        searchInputRef={searchInputRef}
      />

      {error && (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16, color: '#888' }}>
            Найдено объявлений: {totalItems}
          </div>

          <Row gutter={[16, 16]}>
            {ads.map((ad) => (
              <Col xs={24} sm={12} md={8} lg={6} key={ad.id}>
                <AdCard ad={ad} />
              </Col>
            ))}
          </Row>

          {ads.length === 0 && !loading && (
            <div
              style={{ textAlign: 'center', padding: '50px', color: '#888' }}
            >
              Объявления не найдены
            </div>
          )}

          {totalItems > 0 && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Pagination
                current={filters.page}
                total={totalItems}
                pageSize={filters.limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Всего ${total} объявлений`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdsList;
