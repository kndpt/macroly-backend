import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extractUnitFromName, filterEmptyConstituant } from 'src/utils/utils';
import { AlimentWithConstituantsDto } from 'src/type/dto/aliment.dto';
import { Aliment } from 'src/type/entity/aliment.entity';
import { ConstituantDto } from 'src/type/dto/constituant.dto';

@Injectable()
export class AlimentService {
  constructor(
    @InjectRepository(Aliment)
    private readonly alimentRepository: Repository<Aliment>,
  ) {}

  async findOneWithConstituants(
    alim_code: number,
  ): Promise<AlimentWithConstituantsDto> {
    // Récupère l'aliment avec ses constituants
    const alim = await this.alimentRepository.findOne({
      where: { alim_code },
      relations: ['compositions', 'compositions.constituant'],
    });

    if (!alim) {
      throw new NotFoundException(
        `Aliment avec le code ${alim_code} non trouvé`,
      );
    }

    // Mapper les données vers le DTO en filtrant les valeurs null
    const constituants: ConstituantDto[] = alim.compositions
      .map((composition) => ({
        name: composition.constituant.const_nom_fr,
        value: composition.teneur,
        min: composition.min,
        max: composition.max,
        unit: extractUnitFromName(composition.constituant.const_nom_fr),
        confidence: composition.code_confiance,
        code: composition.constituant.const_code,
        source: composition.source_code,
      }))
      .filter(filterEmptyConstituant);

    return {
      code: alim.alim_code,
      name: alim.alim_nom_fr,
      constituants,
    };
  }

  /**
   * Find aliments only with the value/teneur to null or 0. And min or max not null$
   *
   * Because, if we have min or max, we can get the value/teneur from the AI.
   * @param limit { number }
   * @param excludedSubGroupCodes { number[] }
   * @returns { AlimentWithConstituantsDto[] }
   */
  async findIncompleteConstituantAliments(
    alimentLimit: number,
    excludedSubGroupCodes: number[] = [],
  ): Promise<AlimentWithConstituantsDto[]> {
    const query = this.alimentRepository
      .createQueryBuilder('aliment')
      .leftJoinAndSelect('aliment.compositions', 'composition')
      .leftJoinAndSelect('composition.constituant', 'constituant');

    // Si une liste de sous-groupes à exclure est fournie, on applique le filtre
    if (excludedSubGroupCodes.length > 0) {
      query.where(
        'aliment.alim_ssgrp_code NOT IN (:...excludedSubGroupCodes)',
        {
          excludedSubGroupCodes,
        },
      );
    }

    // Conditions sur les compositions incomplètes :
    // Teneur nulle ou égale à 0 ET (min non null OU max non null)
    query
      .andWhere('(composition.teneur IS NULL OR composition.teneur = 0)')
      .andWhere(
        '(composition.min IS NOT NULL AND composition.min != 0 OR composition.max IS NOT NULL AND composition.max != 0)',
      )
      // On ne prend pas les sources AI déjà renseignées
      .andWhere('composition.source_code != :sourceCode', {
        sourceCode: 'AI',
      })
      .distinct(true) // Évite de dupliquer les aliments
      .take(alimentLimit);

    const incompleteAliments = await query.getMany();

    const results: AlimentWithConstituantsDto[] = incompleteAliments.map(
      (aliment) => ({
        code: aliment.alim_code,
        name: aliment.alim_nom_fr || 'Nom inconnu',
        constituants: aliment.compositions
          .filter(
            (c) =>
              (c.teneur === null || c.teneur === 0) &&
              (c.min !== null || c.max !== null),
          ) // On filtre les compositions incomplètes
          .map((c) => ({
            code: c.constituant?.const_code,
            name: c.constituant?.const_nom_fr || 'Nom inconnu',
            value: c.teneur || null,
            min: c.min || null,
            max: c.max || null,
            unit: extractUnitFromName(c.constituant?.const_nom_fr || ''),
            confidence: c.code_confiance || 'N/A',
            source: c.source_code || 'N/A',
          })),
      }),
    );

    return results;
  }
}
