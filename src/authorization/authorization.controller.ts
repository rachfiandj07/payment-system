import { Body, Controller, Post } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { LoginAdminDTO } from './dto/authorization.dto';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/login/admin')
  create(@Body() loginAdminDTO: LoginAdminDTO) {
    return this.authorizationService.loginAsAdmin(loginAdminDTO);
  }
}
