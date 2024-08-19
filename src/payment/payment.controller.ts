import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard } from 'src/authorization/guard/jwt.guard';
import { RequestContext } from 'src/utils/context';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreatePaymentLinkDTO } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('/generate')
    @UseGuards(JwtGuard)
    create(@Body() createPaymentLinkDTO: CreatePaymentLinkDTO, @RequestContext() context: ContextPayload) {
      return this.paymentService.generate(createPaymentLinkDTO, context);
    }
}
