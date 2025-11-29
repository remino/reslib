/**
 * Returns true when value lies between min and max (inclusive).
 */
export const isBetween = (value: number, min: number, max: number): boolean =>
	value >= min && value <= max

export default isBetween
