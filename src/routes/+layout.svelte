<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark' | 'system';
	let theme = $state<Theme>('system');
	let resolved = $state('light'); // actual applied theme

	const STORAGE_KEY = 'theme-preference';

	function applyTheme(t: Theme) {
		if (t === 'system') {
			const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			resolved = dark ? 'dark' : 'light';
		} else {
			resolved = t;
		}
		document.documentElement.classList.toggle('dark', resolved === 'dark');
	}

	function saveTheme(t: Theme) {
		try {
			localStorage.setItem(STORAGE_KEY, t);
		} catch (e) {
			// ignore
		}
	}

	function toggleTheme() {
		if (theme === 'dark') theme = 'light';
		else if (theme === 'light') theme = 'system';
		else theme = 'dark';
		applyTheme(theme);
		saveTheme(theme);
	}

	function handleSystemChange(e: MediaQueryListEvent) {
		if (theme === 'system') applyTheme('system');
	}

	onMount(() => {
		// load saved preference
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
			if (saved === 'light' || saved === 'dark' || saved === 'system') theme = saved;
		} catch (e) {
			// ignore
		}

		// initial apply
		applyTheme(theme);

		// watch system changes
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		// addEventListener may not exist on older Safari, but modern browsers support it
		if (mq.addEventListener) mq.addEventListener('change', handleSystemChange);
		else mq.addListener(handleSystemChange as any);

		return () => {
			if (mq.removeEventListener) mq.removeEventListener('change', handleSystemChange);
			else mq.removeListener(handleSystemChange as any);
		};
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
		</header>
		<main class="site-main">{@render children()}</main>
	</Sidebar.Inset>
</Sidebar.Provider>
