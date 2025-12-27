import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatsController } from './stats.controller';

describe('RoleStatsController', () => {
  let controller: RoleStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleStatsController],
    }).compile();

    controller = module.get<RoleStatsController>(RoleStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
