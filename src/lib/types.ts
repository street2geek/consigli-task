import type { Icon } from '@lucide/svelte';

export type CeilingComponent = {
	id: string;
	name: string;
	color: string;
	icon: Icon;
};

export type Direction = 'in' | 'out';
