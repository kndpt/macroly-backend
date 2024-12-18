import {
  AlimentWithConstituantsDto,
  AlimentWithConstituantDto,
} from 'src/type/dto/aliment.dto';

export class AlimentMapper {
  /**
   * Convertit une liste d'aliments avec des constituants en une liste d'aliments avec un seul constituant.
   * @param aliments - La liste d'aliments avec des constituants.
   * @returns - La liste d'aliments avec un seul constituant.
   */
  public toAlimentWithConstituantDto(
    aliments: AlimentWithConstituantsDto[],
  ): AlimentWithConstituantDto[] {
    return aliments.flatMap((aliment) =>
      aliment.constituants.map((constituant) => ({
        code: aliment.code,
        name: aliment.name,
        constituant: constituant,
      })),
    );
  }
}
