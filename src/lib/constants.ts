const GRID_SIZE = 0.6;
const PIXELS_PER_METER = 66.67; // scale factor
export const CELL_SIZE = GRID_SIZE * PIXELS_PER_METER;

export const CEILING_COMPONENTS = {
	AIR_RETURN: { id: 'air_return', name: 'Air Return' },
	AIR_SUPPLY: { id: 'air_supply', name: 'Air Supply' },
	LIGHT: { id: 'light', name: 'Light' },
	SMOKE_DETECTOR: { id: 'smoke_detector', name: 'Smoke Detector' },
	INVALID_AREA: { id: 'invalid_area', name: 'Invalid Area' }
};
