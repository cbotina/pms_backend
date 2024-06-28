import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRequestsService } from './permission-requests.service';

describe('PermissionRequestsService', () => {
  let service: PermissionRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionRequestsService],
    }).compile();

    service = module.get<PermissionRequestsService>(PermissionRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
