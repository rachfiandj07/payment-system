import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/authorization/guard/jwt.guard';
import { RequestContext } from 'src/utils/context';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreateInvoiceDTO } from './dto/invoice.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Invoice')
@ApiBearerAuth()
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('/create')
  @UseGuards(JwtGuard)
  create(
    @Body() createInvoiceDTO: CreateInvoiceDTO,
    @RequestContext() context: ContextPayload,
  ) {
    return this.invoiceService.create(context, createInvoiceDTO);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search query to filter invoices',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PAID', 'PENDING', 'PARTIALLY_PAID', 'ON_DUE_DATE'],
    description: 'Filter invoices based on their status',
  })
  async getInvoice(
    @Query('search') search?: string,
    @Query('status')
    status?: 'PAID' | 'PENDING' | 'PARTIALLY_PAID' | 'ON_DUE_DATE',
  ) {
    return this.invoiceService.getInvoice({ search, status });
  }
}
