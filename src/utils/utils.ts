import { Composition } from 'src/type/entity/composition.entity';

/**
 * Extract the unit from the name (ex: "(kJ/100 g)" from the string)
 * @param name - The name to extract the unit from
 * @returns The unit extracted from the name
 */
export function extractUnitFromName(name: string): string | undefined {
  const match = name.match(/\((.*?)\)/);
  return match ? match[1].trim() : undefined;
}

export function cleanConstituantName(name: string): string {
  // Liste des patterns de nettoyage
  const cleaningPatterns = [
    /\((.*?)\)/, // Pattern original pour retirer le contenu entre parenthèses
    /,.*$/, // Pattern pour retirer tout ce qui suit une virgule
    // Vous pourrez facilement ajouter d'autres patterns ici, par exemple :
    // /:\s.*$/, // Pour retirer tout ce qui suit les deux points
    // /\d+([.,]\d+)?/, // Pour retirer les nombres
  ];

  // Applique chaque pattern de nettoyage séquentiellement
  return cleaningPatterns
    .reduce((cleanedName, pattern) => cleanedName.replace(pattern, ''), name)
    .trim();
}

/**
 * Filter out the constituant with a null value for the teneur
 * @param constituant - The constituant to filter
 * @returns true if the constituant has at least one non-null value (teneur, min, or max)
 */
export function filterEmptyComposition(composition: Composition) {
  return !(
    (composition.teneur === null || composition.teneur == 0) &&
    (composition.min === null || composition.min == 0) &&
    (composition.max === null || composition.max == 0)
  );
}
