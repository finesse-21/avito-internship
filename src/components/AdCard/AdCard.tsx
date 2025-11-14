import { Card, Tag, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Advertisement } from '../../types';
import {
  formatPrice,
  formatDate,
  getStatusText,
  getStatusColor,
  getPriorityText,
} from '../../utils/helpers';

interface AdCardProps {
  ad: Advertisement;
}

const AdCard = ({ ad }: AdCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/item/${ad.id}`);
  };

  return (
    <Badge.Ribbon
      text={getPriorityText(ad.priority)}
      color={ad.priority === 'urgent' ? 'red' : 'blue'}
      style={{ display: ad.priority === 'urgent' ? 'block' : 'none' }}
    >
      <Card
        hoverable
        onClick={handleClick}
        cover={
          <img
            alt={ad.title}
            src={ad.images[0]}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        }
        style={{ height: '100%' }}
      >
        <Card.Meta
          title={
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {ad.title}
            </div>
          }
          description={
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                {formatPrice(ad.price)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <Tag>{ad.category}</Tag>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <Badge
                  status={getStatusColor(ad.status)}
                  text={getStatusText(ad.status)}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {formatDate(ad.createdAt)}
              </div>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default AdCard;
