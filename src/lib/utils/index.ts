import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CEILING_COMPONENT_TYPES } from '$lib/constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getComponentById(id: string) {
	return CEILING_COMPONENT_TYPES[id.toUpperCase() as keyof typeof CEILING_COMPONENT_TYPES];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
