/**
 * Simple utility for preventing error explosions.
 */
export const bombShield = <T>(action: () => T, fallbackValue?: T): T => {
	try {
		return action();
	} catch (err) {
		return typeof fallbackValue === 'undefined' ? err : fallbackValue;
	}
};