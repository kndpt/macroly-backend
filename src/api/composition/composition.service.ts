import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Composition } from 'src/type/entity/composition.entity';

@Injectable()
export class CompositionService {
  constructor(
    @InjectRepository(Composition)
    private readonly compoRepository: Repository<Composition>,
  ) {}

  public async getCompositionByAlimCodeAndConstituantCode(
    alimCode: number,
    constituantCode: number,
  ): Promise<Composition> {
    return this.compoRepository.findOne({
      where: {
        aliment: { alim_code: alimCode },
        constituant: { const_code: constituantCode },
      },
    });
  }

  /**
   * Update the teneur of a composition by aliment code and constituant code
   * @param alimCode { number }
   * @param constituantCode { number }
   * @param teneur { number }
   * @param isAiSource { boolean }
   * @returns { Composition }
   */
  public async updateTeneurCompositionByAlimCodeAndConstituantCode(
    alimCode: number,
    constituantCode: number,
    teneur: number,
    isAiSource: boolean,
  ): Promise<void> {
    await this.compoRepository.update(
      {
        aliment: { alim_code: alimCode },
        constituant: { const_code: constituantCode },
      },
      { teneur, ...(isAiSource && { source_code: 'AI' }) },
    );
  }
}
