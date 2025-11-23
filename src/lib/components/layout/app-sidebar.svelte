<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import { stageConfig, selectedComponentType } from '$lib/state.svelte';
	import { CEILING_COMPONENT_TYPES as CEILING_COMPONENTS, GRID_SIZE } from '$lib/constants';
	import type { CeilingComponent, Direction } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { updateZoom } from '$lib/utils/stage';
	import { getComponentById } from '$lib/utils';

	type SideBarProps = ComponentProps<typeof Sidebar.Root>;

	let { ref = $bindable(null), ...restProps }: SideBarProps = $props();

	function handleZoom(direction: Direction) {
		stageConfig.zoom = updateZoom(direction, stageConfig.zoom);
	}

	// Sync name when id changes (from ToggleGroup binding or keyboard)
	$effect(() => {
		if (selectedComponentType.id) {
			const component = getComponentById(selectedComponentType.id);
			if (component) {
				selectedComponentType.name = component.name;
			}
		} else {
			selectedComponentType.name = '';
		}
	});

	const roomAreaMeters = $derived(
		(stageConfig.ceilingWidth * stageConfig.ceilingHeight * GRID_SIZE * GRID_SIZE).toFixed(1)
	);
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="text-md text-center font-mono"
		><h1>Room Ceiling Designer</h1></Sidebar.Header
	>
	<Sidebar.Content>
		<Sidebar.Group>
			<div class="flex justify-center gap-4">
				<Button
					variant="secondary"
					size="icon"
					class="size-10 cursor-pointer"
					onclick={() => handleZoom('out')}
					aria-label="Zoom out"
				>
					<ZoomOut />
				</Button>
				<Button
					variant="secondary"
					size="icon"
					class="size-10 cursor-pointer"
					onclick={() => handleZoom('in')}
					aria-label="Zoom in"
				>
					<ZoomIn />
				</Button>
			</div>
		</Sidebar.Group>
		<Sidebar.Group>
			<div class="flex flex-col items-center">
				<h2 class="mb-2 text-xl font-semibold">Add Component</h2>
				<ToggleGroup.Root
					variant="outline"
					orientation="vertical"
					type="single"
					bind:value={selectedComponentType.id}
				>
					{#each Object.values(CEILING_COMPONENTS) as item}
						{@const Icon = item.icon}
						<ToggleGroup.Item value={item.id} class="w-full px-4 py-2">
							<Icon />
							{item.name}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</Sidebar.Group>
		<Sidebar.Group>
			<div class="flex flex-col items-center">
				<h2 class="mb-2 text-xl font-semibold">Alter Dimensions</h2>
				<div class="mb-4 flex w-full flex-col items-center gap-4">
					<p id="width-label">Width: {stageConfig.ceilingWidth}</p>
					<Slider
						type="single"
						bind:value={stageConfig.ceilingWidth}
						max={100}
						step={1}
						class="max-w-[70%]"
						aria-labelledby="width-label"
					/>
				</div>
				<div class="flex w-full flex-col items-center gap-4">
					<p id="height-label">Height: {stageConfig.ceilingHeight}</p>
					<Slider
						type="single"
						bind:value={stageConfig.ceilingHeight}
						max={100}
						step={1}
						class="max-w-[70%]"
						aria-labelledby="height-label"
					/>
				</div>
			</div>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="text-center text-sm text-muted-foreground">
		<div class="border-t pt-2">
			<p>Cell Size: {GRID_SIZE}m × {GRID_SIZE}m = {(GRID_SIZE * GRID_SIZE).toFixed(2)}m²</p>
			<p>
				Grid: {stageConfig.ceilingWidth} × {stageConfig.ceilingHeight} = {stageConfig.ceilingWidth *
					stageConfig.ceilingHeight} cells
			</p>
			<p>
				Total Area: {roomAreaMeters}m²
			</p>
			<p>Zoom: {(stageConfig.zoom * 100).toFixed(0)}%</p>
		</div>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
