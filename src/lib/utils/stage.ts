import type { Direction } from '$lib/types';

export function updateZoom(direction: Direction, prevZoom: number) {
	const newZoom = direction === 'in' ? prevZoom * 1.2 : prevZoom / 1.2;
	return Math.max(0.1, Math.min(newZoom, 5));
}
