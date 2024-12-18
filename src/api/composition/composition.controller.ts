import { Body, Controller, Post } from '@nestjs/common';
import { CompositionService } from './composition.service';
import { AlimentWithConstituantDto } from 'src/type/dto/aliment.dto';
import { buildApiSuccessResponse } from '../adapters/response';
import { AlimentService } from '../aliment/aliment.service';
import { AlimentMapper } from 'src/mapper/aliment.mapper';
import { AIService } from 'src/service/ai.service';

@Controller('composition')
export class CompositionController {
  constructor(
    private readonly compositionService: CompositionService,
    private readonly alimentService: AlimentService,
    private readonly alimentMapper: AlimentMapper,
    private readonly aiService: AIService,
  ) {}

  /**
   * TODO: Make Scheduler for each update teneur composition method
   *
   * Par la suite, créer d'autres méthode d'update (V2, V3, V4, etc.) plus avancées
   * avec des nouveaux paramètres en input pour l'IA, par exemple:
   * teneur, min, max => AI est-ce correct ?
   *
   * Update the teneur of the aliment with the most incomplete constituants
   * @param body { excludedSubGroupCodes: number[]; alimentLimit: number }
   * @returns { AlimentWithConstituantsDto[] }
   */
  @Post('/update-empty-teneur-compositions')
  async updateEmptyTeneurCompositions(
    @Body() body: { excludedSubGroupCodes: number[]; alimentLimit: number },
  ): Promise<ApiResponse<AlimentWithConstituantDto[]>> {
    const { excludedSubGroupCodes, alimentLimit } = body;

    // Récupérer les aliments avec des constituants incomplets
    const alimentsWithIncompleteConstituants =
      await this.alimentService.findIncompleteConstituantAliments(
        alimentLimit,
        excludedSubGroupCodes,
      );

    // Mapper les aliments avec leurs constituants
    const alimentWithConstituantList =
      this.alimentMapper.toAlimentWithConstituantDto(
        alimentsWithIncompleteConstituants,
      );

    // Exécuter les requêtes getTeneur en parallèle
    const results = await Promise.all(
      alimentWithConstituantList.map(async (aliment) => {
        const teneur = await this.aiService.getTeneur(
          aliment.name,
          aliment.constituant.name,
        );

        if (teneur !== null) {
          await this.compositionService.updateTeneurCompositionByAlimCodeAndConstituantCode(
            aliment.code,
            aliment.constituant.code,
            teneur,
            true,
          );

          return {
            type: 'updated',
            aliment: aliment.name,
            constituant: aliment.constituant.name,
            teneur: teneur,
          };
        } else {
          return {
            type: 'not_updated',
            aliment: aliment.name,
            constituant: aliment.constituant.name,
          };
        }
      }),
    );

    // Séparer les résultats en deux listes
    const updatedCompositions = results.filter(
      (r) => r.type === 'updated',
    ) as unknown as { aliment: string; constituant: string; teneur: number }[];

    const nonUpdatedCompositions = results.filter(
      (r) => r.type === 'not_updated',
    ) as unknown as { aliment: string; constituant: string }[];

    return buildApiSuccessResponse({
      data: {
        updatedCompositions,
        nonUpdatedCompositions,
      },
      message: 'Aliments updated with new compositions',
    });
  }
}
