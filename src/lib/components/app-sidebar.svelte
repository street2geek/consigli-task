<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { Button } from './ui/button';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import { stageConfig } from '$lib/state.svelte';
	import type { Direction } from '$lib/types';

	type SideBarProps = ComponentProps<typeof Sidebar.Root>;

	let { ref = $bindable(null), ...restProps }: SideBarProps = $props();

	function setZoom(direction: Direction) {
		const newZoom = direction === 'in' ? stageConfig.zoom * 1.2 : stageConfig.zoom / 1.2;
		stageConfig.zoom = Math.max(0.1, Math.min(newZoom, 5));
	}
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header></Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<div class="flex justify-center gap-4">
				<Button variant="secondary" size="icon" class="size-8" onclick={() => setZoom('in')}>
					<ZoomIn />
				</Button>
				<Button variant="secondary" size="icon" class="size-8" onclick={() => setZoom('out')}>
					<ZoomOut />
				</Button>
			</div>
		</Sidebar.Group>
		<Sidebar.Group>
			<div class="flex flex-col items-center">
				<h2 class="text-2xl">Add Component</h2>
			</div>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
