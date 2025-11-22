import { AlarmSmoke, Fan, Lightbulb, X, WindArrowDown } from '@lucide/svelte';

const GRID_SIZE = 0.6;
const PIXELS_PER_METER = 66.67; // scale factor
export const CELL_SIZE = GRID_SIZE * PIXELS_PER_METER;

export const CEILING_COMPONENTS = {
	AIR_RETURN: {
		id: 'airReturn',
		name: 'Air Return',
		color: 'bg-gray-500/30',
		icon: WindArrowDown
	},
	AIR_SUPPLY: { id: 'airSupply', name: 'Air Supply', color: 'bg-blue-500/30', icon: Fan },
	LIGHT: { id: 'lightFitting', name: 'Light Fitting', color: 'bg-white/30', icon: Lightbulb },
	SMOKE_DETECTOR: {
		id: 'smokeDetector',
		name: 'Smoke Detector',
		color: 'bg-yellow-500/30',
		icon: AlarmSmoke
	},
	INVALID_AREA: { id: 'invalidArea', name: 'Invalid Area', color: 'bg-red-500/30', icon: X }
};
