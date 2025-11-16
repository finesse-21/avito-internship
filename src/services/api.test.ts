const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
    post: mockPost,
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  })),
}));

import { adsApi } from './api';

describe('adsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAds возвращает список объявлений', async () => {
    const adsResponse = {
      ads: [{ id: 1, title: 'Ad 1' }],
      pagination: {
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
      },
    };
    mockGet.mockResolvedValue({ data: adsResponse });

    const result = await adsApi.getAds();
    expect(result).toEqual(adsResponse);
  });

  it('getAdById возвращает объявление по id', async () => {
    const ad = { id: 1, title: 'Ad 1' };
    mockGet.mockResolvedValue({ data: ad });

    const result = await adsApi.getAdById(1);
    expect(result).toEqual(ad);
  });

  it('approveAd одобряет объявление', async () => {
    const response = {
      message: 'Объявление одобрено',
      ad: { id: 1, status: 'approved' },
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await adsApi.approveAd(1);
    expect(result).toEqual(response);
  });

  it('rejectAd отклоняет объявление', async () => {
    const response = {
      message: 'Объявление отклонено',
      ad: { id: 1, status: 'rejected' },
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await adsApi.rejectAd(1, 'Запрещенный товар', 'Комментарий');
    expect(result).toEqual(response);
  });

  it('requestChanges запрашивает изменения', async () => {
    const response = {
      message: 'Запрошены изменения',
      ad: { id: 1, status: 'pending' },
    };
    mockPost.mockResolvedValue({ data: response });

    const result = await adsApi.requestChanges(1, 'Некорректное описание');
    expect(result).toEqual(response);
  });
});
