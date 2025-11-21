<script lang="ts">
	import { browser } from '$app/environment';
	import { CELL_SIZE } from '$lib/constants';
	import type { Component, Direction } from '$lib/types';
	import { onMount } from 'svelte';
	import { Layer, Stage, Rect } from 'svelte-konva';

	let stageContainerEl: HTMLDivElement | null = null;
	let stageConfig = $state({
		width: 1024,
		height: 768,
		position: { x: 50, y: 50 },
		zoom: 1
	});

	let invalidCells = $state(new Set());
	let components = $state([]);
	let selectedComponentId = $state(null);
	let selectedComponentControl = $state(null);

	function setZoom(direction: Direction) {}
	function addComponent(component: Component) {}

	onMount(() => {
		if (stageContainerEl) {
			stageConfig.width = stageContainerEl.offsetWidth;
			stageConfig.height = stageContainerEl.offsetHeight;
		}
	});
</script>

<div
	id="stageContainer"
	data-testid="stageContainer"
	bind:this={stageContainerEl}
	class="flex overflow-hidden bg-indigo-100"
>
	{#if browser}
		<Stage
			width={stageConfig.width}
			height={stageConfig.height}
			y={stageConfig.position.y}
			x={stageConfig.position.x}
			scaleX={stageConfig.zoom}
			scaleY={stageConfig.zoom}
		>
			<Layer>
				<Rect
					x={0}
					y={0}
					width={stageConfig.width * CELL_SIZE}
					height={stageConfig.height * CELL_SIZE}
					fill="#fff"
					stroke="#ddd"
					strokeWidth={1}
				></Rect>
			</Layer>
		</Stage>
	{/if}
</div>

<style>
	#stageContainer {
		max-width: 1024;
		max-height: 768;
		width: 100%;
		height: 100%;
	}
</style>
