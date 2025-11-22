<script lang="ts">
	import { onMount } from 'svelte';
	import { Layer, Stage, Rect, Line } from 'svelte-konva';
	import { browser } from '$app/environment';
	import { CELL_SIZE } from '$lib/constants';
	import type { Component, Direction } from '$lib/types';
	import { stageConfig } from '$lib/state.svelte';

	let stageContainerEl: HTMLDivElement | null = null;

	let invalidCells = $state(new Set());
	let components = $state([]);
	let selectedComponentId = $state(null);
	let selectedComponentControl = $state(null);

	let gridLinesHorizontal = $derived(stageConfig.ceilingHeight + 1);
	let gridLinesVertical = $derived(stageConfig.ceilingWidth + 1);

	function addComponent(component: Component) {}

	onMount(() => {
		if (stageContainerEl) {
			stageConfig.dimensions.width = window.innerWidth - 255;
			stageConfig.dimensions.height = window.innerHeight - 64;
		}
	});
</script>

<div
	id="stageContainer"
	data-testid="stageContainer"
	bind:this={stageContainerEl}
	class="flex overflow-hidden bg-gray-100"
>
	{#if browser}
		<Stage
			width={stageConfig.dimensions.width}
			height={stageConfig.dimensions.height}
			y={stageConfig.position.y}
			x={stageConfig.position.x}
			scaleX={stageConfig.zoom}
			scaleY={stageConfig.zoom}
		>
			<Layer>
				<Rect
					x={0}
					y={0}
					width={stageConfig.ceilingWidth * CELL_SIZE}
					height={stageConfig.ceilingHeight * CELL_SIZE}
					fill="#fff"
					stroke="#ddd"
					strokeWidth={1}
				/>
				{#each Array(gridLinesVertical) as _, index}
					<Line
						stroke="#e5e7eb"
						strokeWidth={1}
						points={[
							index * CELL_SIZE,
							0,
							index * CELL_SIZE,
							stageConfig.ceilingHeight * CELL_SIZE
						]}
					/>
				{/each}
				{#each Array(gridLinesHorizontal) as _, index}
					<Line
						stroke="#e5e7eb"
						strokeWidth={1}
						points={[0, index * CELL_SIZE, stageConfig.ceilingWidth * CELL_SIZE, index * CELL_SIZE]}
					/>
				{/each}
			</Layer>
		</Stage>
	{/if}
</div>
