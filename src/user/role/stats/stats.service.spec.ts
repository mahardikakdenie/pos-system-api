import { Test, TestingModule } from '@nestjs/testing';
import { RoleStatsService } from './stats.service';

describe('RoleStatsService', () => {
  let service: RoleStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleStatsService],
    }).compile();

    service = module.get<RoleStatsService>(RoleStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
