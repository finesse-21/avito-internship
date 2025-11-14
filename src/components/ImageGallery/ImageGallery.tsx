import { useState } from 'react';
import { Image } from 'antd';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}
// Компонент для отображения галереи изображений (placeholder, тк в реализовывать загрузку реальных изображений не нужно)
const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const displayImages =
    images.length > 0 ? images : ['https://via.placeholder.com/600x400'];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Image
          src={displayImages[currentImage]}
          alt={alt}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {displayImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            onClick={() => setCurrentImage(index)}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer',
              border:
                currentImage === index
                  ? '2px solid #1890ff'
                  : '2px solid transparent',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
