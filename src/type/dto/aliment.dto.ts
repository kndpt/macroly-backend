import { ConstituantDto } from './constituant.dto';

/**
 * DTO pour les aliments avec les compositions.
 */
export class AlimentWithConstituantsDto {
  /**
   * Code de l'aliment
   */
  code: number;
  /**
   * Nom de l'aliment
   */
  name: string;
  /**
   * Liste des constituants
   */
  constituants: ConstituantDto[];
}

/**
 * DTO pour les aliments avec un seul constituant. Utilisé pour le scan des aliments pour l'IA.
 */
export class AlimentWithConstituantDto {
  code: number;
  name: string;
  constituant: ConstituantDto;
}
