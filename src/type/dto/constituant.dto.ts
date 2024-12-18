export class ConstituantDto {
  /**
   * Nom du constituant
   */
  name: string;
  /**
   * Code du constituant
   */
  code: number;
  /**
   * Unité extraite du nom (ex: "kJ/100 g")
   */
  unit: string;
  /**
   * Teneur moyenne de l'aliment. Priorité sur le min et max si existant.
   */
  value?: number;
  /**
   * Valeur minimale de l'aliment, si existante.
   */
  min?: number;
  /**
   * Valeur maximale de l'aliment, si existante.
   */
  max?: number;
  /**
   * Niveau de fiabilité (A, B, C, D)
   */
  confidence: string;
  /**
   * Source de la teneur (IA, API, ...)
   */
  source: string;
}
