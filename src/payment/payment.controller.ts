import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard } from 'src/authorization/guard/jwt.guard';
import { RequestContext } from 'src/utils/context';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreatePaymentLinkDTO } from './dto/payment.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/generate')
  @UseGuards(JwtGuard)
  create(
    @Body() createPaymentLinkDTO: CreatePaymentLinkDTO,
    @RequestContext() context: ContextPayload,
  ) {
    return this.paymentService.generate(createPaymentLinkDTO, context);
  }

  @Get('/verify')
  @ApiQuery({
    name: 'user',
    type: String,
    required: true,
    description: 'User ID associated with the payment',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    required: true,
    description: 'Payment amount',
  })
  @ApiQuery({
    name: 'expires',
    type: String,
    required: true,
    description: 'Expiration date/time for the payment',
  })
  @ApiQuery({
    name: 'invoices_id',
    type: String,
    required: true,
    description: 'Invoice ID associated with the payment',
  })
  @ApiQuery({
    name: 'signature',
    type: String,
    required: true,
    description: 'Digital signature for verifying the payment',
  })
  paid(@Query() query: any) {
    const { user, amount, expires, invoices_id, signature } = query;
    return this.paymentService.payment(
      user,
      amount,
      expires,
      invoices_id,
      signature,
    );
  }
}
