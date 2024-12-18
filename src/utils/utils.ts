import { ConstituantDto } from '../type/dto/constituant.dto';

/**
 * Extract the unit from the name (ex: "(kJ/100 g)" from the string)
 * @param name - The name to extract the unit from
 * @returns The unit extracted from the name
 */
export function extractUnitFromName(name: string): string | undefined {
  const match = name.match(/\((.*?)\)/);
  return match ? match[1] : undefined;
}

/**
 * Filter out the constituant with a null value for the teneur
 * @param constituant - The constituant to filter
 * @returns true if the constituant has at least one non-null value (teneur, min, or max)
 */
export function filterEmptyConstituant(constituant: ConstituantDto): boolean {
  return !(
    (constituant.value === null || constituant.value == 0) &&
    constituant.min === null &&
    constituant.max === null
  );
}
