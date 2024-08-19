import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDTO } from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  create(@Body() createAdminDTO: CreateAdminDTO) {
    return this.adminService.create(createAdminDTO);
  }
}
