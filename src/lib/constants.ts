import { AlarmSmoke, Fan, Lightbulb, X, WindArrowDown } from '@lucide/svelte';
import {
	AlarmSmoke as AlarmSmokeIcon,
	Fan as FanIcon,
	Lightbulb as LightbulbIcon,
	X as XIcon,
	WindArrowDown as WindArrowDownIcon
} from 'lucide';

export const SIDEBAR_WIDTH_PX = 255;
export const HEADER_HEIGHT_PX = 64;

const PIXELS_PER_METER = 66.67; // scale factor
export const GRID_SIZE = 0.6;
export const CELL_SIZE = GRID_SIZE * PIXELS_PER_METER;

// Helper to convert lucide icon to SVG path string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSvgPaths(iconData: any): string[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return iconData.filter((item: any) => item[0] === 'path').map((item: any) => item[1].d);
}

// Note: we want to map id to key names for easier access
export const CEILING_COMPONENT_TYPES = {
	AIR_RETURN: {
		id: 'air_return',
		name: 'Air Return',
		color: 'rgba(107, 114, 128, 0.3)',
		svgPaths: getSvgPaths(WindArrowDownIcon),
		icon: WindArrowDown
	},
	AIR_SUPPLY: {
		id: 'air_supply',
		name: 'Air Supply',
		color: 'rgba(59, 130, 246, 0.3)',
		svgPaths: getSvgPaths(FanIcon),
		icon: Fan
	},
	LIGHT: {
		id: 'light',
		name: 'Light Fitting',
		color: 'rgba(255, 255, 255, 0.3)',
		svgPaths: getSvgPaths(LightbulbIcon),
		icon: Lightbulb
	},
	SMOKE_DETECTOR: {
		id: 'smoke_detector',
		name: 'Smoke Detector',
		color: 'rgba(234, 179, 8, 0.3)',
		svgPaths: getSvgPaths(AlarmSmokeIcon),
		icon: AlarmSmoke
	},
	INVALID_AREA: {
		id: 'invalid_area',
		name: 'Invalid Area',
		color: 'rgba(239, 68, 68, 0.3)',
		svgPaths: getSvgPaths(XIcon),
		icon: X
	}
};
