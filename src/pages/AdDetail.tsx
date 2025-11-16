import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Button,
  Space,
  Spin,
  Alert,
  Tag,
  Badge,
} from 'antd';
import {
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import ModerationHistory from '../components/ModerationHistory/ModerationHistory';
import ModerationActions from '../components/ModerationActions/ModerationActions';
import { adsApi } from '../services/api';
import type { Advertisement, RejectReason } from '../types';
import {
  formatPrice,
  formatDate,
  getStatusText,
  getStatusColor,
  getPriorityText,
} from '../utils/helpers';
import { useHotkeys } from '../hooks/useHotkeys';

const { Title, Paragraph } = Typography;

const AdDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const approveRef = useRef<(() => void) | null>(null);
  const rejectRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (id) {
      fetchAd(Number(id));
    }
  }, [id]);

  const fetchAd = async (adId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adsApi.getAdById(adId);
      setAd(data);
    } catch (err) {
      setError('Ошибка при загрузке объявления');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!ad) return;
    await adsApi.approveAd(ad.id);
    await fetchAd(ad.id);
  };

  const handleReject = async (reason: RejectReason, comment?: string) => {
    if (!ad) return;
    await adsApi.rejectAd(ad.id, reason, comment);
    await fetchAd(ad.id);
  };

  const handleRequestChanges = async (
    reason: RejectReason,
    comment?: string
  ) => {
    if (!ad) return;
    await adsApi.requestChanges(ad.id, reason, comment);
    await fetchAd(ad.id);
  };

  const handlePrevious = () => {
    if (ad && ad.id > 1) {
      navigate(`/item/${ad.id - 1}`);
    }
  };

  const handleNext = () => {
    if (ad) {
      navigate(`/item/${ad.id + 1}`);
    }
  };

  useHotkeys(
    {
      a: () => {
        if (ad && ad.status === 'pending' && approveRef.current) {
          approveRef.current();
        }
      },
      d: () => {
        if (ad && ad.status === 'pending' && rejectRef.current) {
          rejectRef.current();
        }
      },
      arrowleft: handlePrevious,
      arrowright: handleNext,
    },
    !loading && !!ad
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div>
        <Alert
          message="Ошибка"
          description={error || 'Объявление не найдено'}
          type="error"
        />
        <Button
          type="primary"
          onClick={() => navigate('/list')}
          style={{ marginTop: 16 }}
        >
          Вернуться к списку
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/list')}>
          Назад к списку
        </Button>
        <Button icon={<LeftOutlined />} onClick={handlePrevious}>
          Предыдущее
        </Button>
        <Button icon={<RightOutlined />} onClick={handleNext}>
          Следующее
        </Button>
      </Space>

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card>
            <Title level={3}>{ad.title}</Title>

            <div style={{ marginBottom: 16 }}>
              <Space>
                <Badge
                  status={getStatusColor(ad.status)}
                  text={getStatusText(ad.status)}
                />
                <Tag color={ad.priority === 'urgent' ? 'red' : 'blue'}>
                  {getPriorityText(ad.priority)}
                </Tag>
                <Tag>{ad.category}</Tag>
              </Space>
            </div>

            <Title level={2} style={{ color: '#1890ff', marginBottom: 16 }}>
              {formatPrice(ad.price)}
            </Title>

            <ImageGallery images={ad.images} alt={ad.title} />

            <Paragraph style={{ marginTop: 24, fontSize: '16px' }}>
              {ad.description}
            </Paragraph>
          </Card>

          <Card title="Характеристики" style={{ marginTop: 16 }}>
            <Descriptions column={1} bordered>
              {Object.entries(ad.characteristics).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Информация о продавце" style={{ marginBottom: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Имя">
                {ad.seller.name}
              </Descriptions.Item>
              <Descriptions.Item label="Рейтинг">
                {ad.seller.rating}
              </Descriptions.Item>
              <Descriptions.Item label="Объявлений">
                {ad.seller.totalAds}
              </Descriptions.Item>
              <Descriptions.Item label="Дата регистрации">
                {formatDate(ad.seller.registeredAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="История модерации" style={{ marginBottom: 16 }}>
            <ModerationHistory history={ad.moderationHistory} />
          </Card>

          <Card title="Действия модератора">
            <ModerationActions
              adId={ad.id}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={handleRequestChanges}
              disabled={ad.status === 'approved' || ad.status === 'rejected'}
              approveRef={approveRef}
              rejectRef={rejectRef}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdDetail;
