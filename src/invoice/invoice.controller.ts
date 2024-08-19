import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtGuard } from 'src/authorization/guard/jwt.guard';
import { RequestContext } from 'src/utils/context';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreateInvoiceDTO } from './dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Post('/create')
    @UseGuards(JwtGuard)
    create(@Body() createInvoiceDTO: CreateInvoiceDTO, @RequestContext() context: ContextPayload) {
      return this.invoiceService.create(context, createInvoiceDTO);
    }
}
