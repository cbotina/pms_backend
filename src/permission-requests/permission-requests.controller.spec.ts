import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRequestsController } from './permission-requests.controller';
import { PermissionRequestsService } from './permission-requests.service';

describe('PermissionRequestsController', () => {
  let controller: PermissionRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionRequestsController],
      providers: [PermissionRequestsService],
    }).compile();

    controller = module.get<PermissionRequestsController>(PermissionRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
