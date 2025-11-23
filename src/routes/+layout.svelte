<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	import { Sun, Moon } from '@lucide/svelte';

	let { children } = $props();
	import { onMount } from 'svelte';
	import { selectedComponentType } from '$lib/state.svelte';

	type Theme = 'light' | 'dark';
	let theme = $state<Theme>('dark');

	const STORAGE_KEY = 'theme-preference';

	function applyTheme(t: Theme) {
		theme = t;
		document.documentElement.classList.toggle('dark', t === 'dark');
		// Save preference
		try {
			localStorage.setItem(STORAGE_KEY, t);
		} catch (e) {
			console.error('Failed to save theme preference', e);
		}
	}

	function toggleTheme() {
		applyTheme(theme === 'dark' ? 'light' : 'dark');
	}

	onMount(() => {
		// Load saved preference
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
			if (saved === 'light' || saved === 'dark') {
				theme = saved;
			}
		} catch (e) {
			console.error('Failed to load theme preference', e);
		}
		// apply current theme to DOM
		document.documentElement.classList.toggle('dark', theme === 'dark');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b">
			<div class="flex items-center gap-2 px-3">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 h-4" />
			</div>
			<p class="flex-1 text-sm">
				<span class="font-semibold">Selected Component:</span>
				{selectedComponentType.name}
			</p>
			<div class="flex items-center gap-2 px-3">
				<Toggle pressed={theme === 'dark'} onPressedChange={toggleTheme} aria-label="Toggle theme">
					{#if theme === 'dark'}
						<Moon class="h-4 w-4" />
					{:else}
						<Sun class="h-4 w-4" />
					{/if}
				</Toggle>
			</div>
		</header>
		<main class="site-main">{@render children()}</main>
	</Sidebar.Inset>
</Sidebar.Provider>
