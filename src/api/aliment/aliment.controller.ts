import { Controller, Get, Param } from '@nestjs/common';
import { AlimentWithConstituantsDto } from '../../type/dto/aliment.dto';
import { AlimentService } from './aliment.service';
import { buildApiSuccessResponse } from '../adapters/response';

@Controller('aliment')
export class AlimentController {
  constructor(private readonly alimentService: AlimentService) {}

  @Get(':alim_code')
  async getAlimWithConstituants(
    @Param('alim_code') alim_code: number,
  ): Promise<ApiResponse<AlimentWithConstituantsDto>> {
    const response =
      await this.alimentService.findOneWithConstituants(alim_code);
    return buildApiSuccessResponse({
      data: response,
      message: 'Aliment found',
    });
  }
}
