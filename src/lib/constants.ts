import { AlarmSmoke, Fan, Lightbulb, X, WindArrowDown } from '@lucide/svelte';

const GRID_SIZE = 0.6;
const PIXELS_PER_METER = 66.67; // scale factor
export const CELL_SIZE = GRID_SIZE * PIXELS_PER_METER;

// Note: we want to map id to key names for easier access
export const CEILING_COMPONENT_TYPES = {
	AIR_RETURN: {
		id: 'air_return',
		name: 'Air Return',
		color: '#6B7280',
		canvasColor: 'bg-gray-500/30',
		symbol: '↓',
		icon: WindArrowDown
	},
	AIR_SUPPLY: {
		id: 'air_supply',
		name: 'Air Supply',
		color: '#3B82F6',
		canvasColor: 'bg-blue-500/30',
		symbol: '○',
		icon: Fan
	},
	LIGHT: {
		id: 'light',
		name: 'Light Fitting',
		color: '#FCD34D',
		canvasColor: 'bg-white/30',
		symbol: '●',
		icon: Lightbulb
	},
	SMOKE_DETECTOR: {
		id: 'smoke_detector',
		name: 'Smoke Detector',
		color: '#EAB308',
		canvasColor: 'bg-yellow-500/30',
		symbol: '◉',
		icon: AlarmSmoke
	},
	INVALID_AREA: {
		id: 'invalid_area',
		name: 'Invalid Area',
		color: '#EF4444',
		canvasColor: 'bg-red-500/30',
		symbol: '✕',
		icon: X
	}
};
