/**
 * Simple utility for preventing Error explosions.
 */
export const bombShield = <T>(action: () => T, fallbackValue?: T): T => {
	try {
		return action();
	} catch (err) {
		return typeof fallbackValue === 'undefined' ? err : fallbackValue;
	}
};