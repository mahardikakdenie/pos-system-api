// src/product/product.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import { RequireProfile } from '../common/decorator/require-profile.decorator';
import { Profile } from '../common/types/profile.type';
import { CreateProductDTO, UpdateProduct, UserStatus } from './product.dto';

const mockCreateProductDTO: CreateProductDTO = {
  name: 'Test Product',
  description: 'Test description',
  image: 'https://example.com/image.jpg',
  price: '100.00',
  status: UserStatus.ACTIVE,
  logs: { createdBy: 'admin', createdAt: '2025-04-01T00:00:00Z', data: [] },
  categoryId: 'cat_01',
  slug: 'test-product',
};

const mockUpdateProductDTO: UpdateProduct = {
  name: 'Updated Product',
  description: 'Updated description',
  image: 'https://example.com/updated.jpg',
  price: '120.00',
  status: UserStatus.ACTIVE,
  slug: 'updated-product',
  logs: { updatedBy: 'admin', updatedAt: '2025-04-02T00:00:00Z', data: [] },
};

const mockProduct = {
  id: 'prod_999',
  ...mockCreateProductDTO,
  created_at: '2025-04-01T00:00:00Z',
  updated_at: null,
};

const mockSummary = {
  all: 10,
  active: 8,
  inactive: 1,
  suspend: 1,
};

const mockProfile: Profile = {
  id: 'user_1',
  email: 'test@example.com',
  role: 'admin',
};

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getDataProducts: jest.fn(),
            getSummaryProducts: jest.fn(),
            createProduct: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(RequireProfile)
      .useValue(() => mockProfile)
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return a list of products', async () => {
      const resultValue = [mockProduct];
      jest.spyOn(service, 'getDataProducts').mockResolvedValueOnce(resultValue);
      const result = await controller.getData();
      expect(result).toEqual(resultValue);
      expect(service.getDataProducts).toHaveBeenCalled();
    });
  });

  describe('getSummaryData', () => {
    it('should return product summary statistics', async () => {
      jest.spyOn(service, 'getSummaryProducts').mockResolvedValueOnce(mockSummary);
      const result = await controller.getSummaryData();
      expect(result).toEqual(mockSummary);
      expect(service.getSummaryProducts).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
  it('should create and return a new product', async () => {
    const serviceResponse = { data: [mockProduct] };
    jest.spyOn(service, 'createProduct').mockResolvedValueOnce(serviceResponse as any);
    const result = await controller.createProduct(mockCreateProductDTO);
    expect(result).toEqual(serviceResponse);
    expect(service.createProduct).toHaveBeenCalledWith(mockCreateProductDTO);
  });
});

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const productId = 'prod_999';
      const resultValue = [mockProduct];
      jest.spyOn(service, 'getProductById').mockResolvedValueOnce(resultValue);
      const result = await controller.getProductById(productId);
      expect(result).toEqual(resultValue);
      expect(service.getProductById).toHaveBeenCalledWith(productId);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const productId = 'prod_999';
      const updatedProduct = {
        ...mockProduct,
        ...mockUpdateProductDTO,
        updated_at: '2025-04-02T00:00:00Z',
      };
      const resultValue = [updatedProduct];
      jest.spyOn(service, 'updateProduct').mockResolvedValueOnce(resultValue);
      const result = await controller.updateProduct(productId, mockUpdateProductDTO, mockProfile);
      expect(result).toEqual(resultValue);
      expect(service.updateProduct).toHaveBeenCalledWith(
        mockUpdateProductDTO,
        productId,
        mockProfile,
      );
    });
  });
});
