<script lang="ts">
	import { onMount } from 'svelte';
	import { Layer, Stage, Rect, Line, type KonvaWheelEvent } from 'svelte-konva';
	import { browser } from '$app/environment';
	import { CELL_SIZE } from '$lib/constants';
	import type { Component } from '$lib/types';
	import { stageConfig } from '$lib/state.svelte';
	import { updateZoom } from '$lib/utils/stage';

	let stageContainerEl: HTMLDivElement | null = null;

	let invalidCells = $state(new Set());
	let components = $state([]);
	let selectedComponentId = $state(null);
	let selectedComponentControl = $state(null);

	let gridLinesHorizontal = $derived(stageConfig.ceilingHeight + 1);
	let gridLinesVertical = $derived(stageConfig.ceilingWidth + 1);

	onMount(() => {
		if (stageContainerEl) {
			stageConfig.dimensions.width = window.innerWidth - 255;
			stageConfig.dimensions.height = window.innerHeight - 64;
		}
	});

	function handleZoom(e: KonvaWheelEvent) {
		e.evt.preventDefault();

		const stage = e.target.getStage();
		if (!stage) return;

		const prevScale = stageConfig.zoom;
		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		const mousePointTo = {
			x: (pointer.x - stageConfig.position.x) / prevScale,
			y: (pointer.y - stageConfig.position.y) / prevScale
		};

		const direction = e.evt.deltaY < 0 ? 'in' : 'out';
		const newScale = updateZoom(direction, prevScale);

		stageConfig.zoom = newScale;
		stageConfig.position.x = pointer.x - mousePointTo.x * newScale;
		stageConfig.position.y = pointer.y - mousePointTo.y * newScale;
	}
</script>

<div
	id="stageContainer"
	data-testid="stageContainer"
	bind:this={stageContainerEl}
	class="overflow-hidden bg-gray-100"
>
	{#if browser}
		<Stage
			width={stageConfig.dimensions.width}
			height={stageConfig.dimensions.height}
			y={stageConfig.position.y}
			x={stageConfig.position.x}
			scaleX={stageConfig.zoom}
			scaleY={stageConfig.zoom}
			draggable={true}
			onwheel={handleZoom}
			ondragend={(e) => {
				const pos = e.target.position();
				stageConfig.position.x = pos.x;
				stageConfig.position.y = pos.y;
			}}
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
