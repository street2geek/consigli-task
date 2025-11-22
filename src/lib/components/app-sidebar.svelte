<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from './ui/button';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import { stageConfig } from '$lib/state.svelte';
	import type { Component, Direction } from '$lib/types';
	import { updateZoom } from '$lib/utils/stage';
	import { CEILING_COMPONENTS } from '$lib/constants';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	type SideBarProps = ComponentProps<typeof Sidebar.Root>;

	let { ref = $bindable(null), ...restProps }: SideBarProps = $props();

	function handleZoom(direction: Direction) {
		stageConfig.zoom = updateZoom(direction, stageConfig.zoom);
	}

	function handleAddComponent(component: Component) {}
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header></Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<div class="flex justify-center gap-4">
				<Button
					variant="secondary"
					size="icon"
					class="size-10 cursor-pointer"
					onclick={() => handleZoom('out')}
				>
					<ZoomOut />
				</Button>
				<Button
					variant="secondary"
					size="icon"
					class="size-10 cursor-pointer"
					onclick={() => handleZoom('in')}
				>
					<ZoomIn />
				</Button>
			</div>
		</Sidebar.Group>
		<Sidebar.Group>
			<div class="flex flex-col items-center">
				<h2 class="text-2xl">Add Component</h2>
				<ToggleGroup.Root variant="outline" orientation="vertical" type="single">
					{#each Object.values(CEILING_COMPONENTS) as component}
						<ToggleGroup.Item
							value={component.id}
							onclick={() => handleAddComponent(component as Component)}
						>
							{component.name}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
