import { Body, Controller, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { LoginAdminDTO } from './dto/authorization.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/login/admin')
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 404, description: 'Missmatch credentials' })
  @ApiResponse({ status: 404, description: 'Admin doesnt exists' })
  create(@Body() loginAdminDTO: LoginAdminDTO) {
    return this.authorizationService.loginAsAdmin(loginAdminDTO);
  }
}
