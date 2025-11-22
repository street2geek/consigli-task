<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '../ui/button';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import { stageConfig, selectedComponent } from '$lib/state.svelte';
	import type { CeilingComponent, Direction } from '$lib/types';
	import { updateZoom } from '$lib/utils/stage';
	import { CEILING_COMPONENT_TYPES as CEILING_COMPONENTS } from '$lib/constants';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	type SideBarProps = ComponentProps<typeof Sidebar.Root>;

	let { ref = $bindable(null), ...restProps }: SideBarProps = $props();

	function handleZoom(direction: Direction) {
		stageConfig.zoom = updateZoom(direction, stageConfig.zoom);
	}

	function handleSelectComponent(component: CeilingComponent) {
		// Toggle selection off if the same component is clicked
		if (selectedComponent.id === component.id) {
			selectedComponent.id = '';
			selectedComponent.name = '';
			return;
		}
		selectedComponent.id = component.id;
		selectedComponent.name = component.name;
	}
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
				<h2 class="mb-2 text-xl font-semibold">Add Component</h2>
				<ToggleGroup.Root variant="outline" orientation="vertical" type="single">
					{#each Object.values(CEILING_COMPONENTS) as item}
						{@const Icon = item.icon}
						<ToggleGroup.Item
							value={item.id}
							onclick={() => handleSelectComponent(item as CeilingComponent)}
							class="w-full px-4 py-2"
						>
							<Icon />
							{item.name}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
