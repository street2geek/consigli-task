const GRID_SIZE = 0.6;
const PIXELS_PER_METER = 66.67; // scale factor
export const CELL_SIZE = GRID_SIZE * PIXELS_PER_METER;

export const CEILING_COMPONENTS = {
	AIR_RETURN: { id: 'airReturn', name: 'Air Return', color: 'bg-gray-500/30' },
	AIR_SUPPLY: { id: 'airSupply', name: 'Air Supply', color: 'bg-blue-500/30' },
	LIGHT: { id: 'lightFitting', name: 'Light Fitting', color: 'bg-white/30' },
	SMOKE_DETECTOR: { id: 'smokeDetector', name: 'Smoke Detector', color: 'bg-yellow-500/30' },
	INVALID_AREA: { id: 'invalidArea', name: 'Invalid Area', color: 'bg-red-500/30' }
};
