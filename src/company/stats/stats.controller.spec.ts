import { Test, TestingModule } from '@nestjs/testing';
import { CompanyStatsController } from './stats.controller';

describe('CompanyStatsController', () => {
  let controller: CompanyStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyStatsController],
    }).compile();

    controller = module.get<CompanyStatsController>(CompanyStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
