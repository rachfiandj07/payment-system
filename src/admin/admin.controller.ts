import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDTO } from './dto/admin.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  @ApiResponse({ status: 201, description: 'Admin created' })
  @ApiBody({
    type: CreateAdminDTO,
    description: 'Json structure for user object',
  })
  create(@Body() createAdminDTO: CreateAdminDTO) {
    return this.adminService.create(createAdminDTO);
  }
}
