<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Layer,
		Stage,
		Rect,
		Line,
		type KonvaWheelEvent,
		type KonvaMouseEvent
	} from 'svelte-konva';
	import { browser } from '$app/environment';
	import { CEILING_COMPONENT_TYPES as CEILING_COMPONENTS, CELL_SIZE } from '$lib/constants';
	import { selectedComponent, stageConfig } from '$lib/state.svelte';
	import { updateZoom } from '$lib/utils/stage';
	import { SvelteSet } from 'svelte/reactivity';
	import CeilingInvalid from '$lib/components/ceiling-invalid.svelte';
	import CeilingComponent from '$lib/components/ceiling-component.svelte';
	import type { StageComponent } from '$lib/types';

	let stageContainerEl: HTMLDivElement | null = null;
	let stageComponents = $state<StageComponent[]>([]);
	let selectedStageComponentId = $state(null);
	let invalidCells = new SvelteSet('');

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

	function handleStageClick(e: KonvaMouseEvent) {
		const stage = e.target.getStage();
		if (!stage) return;

		const pointer = stage.getPointerPosition();
		if (!pointer) return;

		// Convert pointer position to stage coordinates
		const stageX = (pointer.x - stageConfig.position.x) / stageConfig.zoom;
		const stageY = (pointer.y - stageConfig.position.y) / stageConfig.zoom;

		const x = Math.floor(stageX / CELL_SIZE);
		const y = Math.floor(stageY / CELL_SIZE);

		/* console.log('Click debug:', {
			pointer,
			stageConfig: { position: stageConfig.position, zoom: stageConfig.zoom },
			stageCoords: { stageX, stageY },
			cellCoords: { x, y },
			cellCoord: `${x},${y}`,
			CELL_SIZE,
			invalidCellsBefore: Array.from(invalidCells)
		}); */

		if (x >= 0 && x < stageConfig.ceilingWidth && y >= 0 && y < stageConfig.ceilingHeight) {
			const cellCoord = `${x},${y}`;

			if (selectedComponent.id === CEILING_COMPONENTS.INVALID_AREA.id) {
				if (invalidCells.has(cellCoord)) {
					invalidCells.delete(cellCoord);
				} else {
					invalidCells.add(cellCoord);
				}
			}

			if (selectedComponent.id && selectedComponent.id !== CEILING_COMPONENTS.INVALID_AREA.id) {
				if (!invalidCells.has(cellCoord)) {
					//Check if component already exists at this position
					const exists = stageComponents.some((comp) => comp.x === x && comp.y === y);
					if (exists) return;
					const newComponent = {
						id: crypto.randomUUID(),
						type: selectedComponent.id,
						x: x,
						y: y
					};
					stageComponents = [...stageComponents, newComponent];
				}
			}
		}
	}
</script>

<div
	id="stageContainer"
	data-testid="stageContainer"
	bind:this={stageContainerEl}
	class="overflow-hidden bg-gray-100"
	style="cursor: {selectedComponent.id ? 'crosshair' : 'default'}"
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
			onclick={handleStageClick}
		>
			<Layer>
				<Rect
					x={0}
					y={0}
					width={stageConfig.ceilingWidth * CELL_SIZE}
					height={stageConfig.ceilingHeight * CELL_SIZE}
					fill="#E2E2D7"
					stroke="#ddd"
					strokeWidth={1}
				/>
				{#each Array(gridLinesVertical) as _, index}
					<Line
						stroke="#6D8196"
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
						stroke="#6D8196"
						strokeWidth={1}
						points={[0, index * CELL_SIZE, stageConfig.ceilingWidth * CELL_SIZE, index * CELL_SIZE]}
					/>
				{/each}

				{#each Array.from(invalidCells) as cell (cell)}
					{@const [x, y] = cell.split(',').map(Number)}
					<CeilingInvalid
						coords={[x * CELL_SIZE, y * CELL_SIZE]}
						width={CELL_SIZE}
						height={CELL_SIZE}
					/>
				{/each}

				{#each stageComponents as comp (comp.id)}
					<CeilingComponent component={comp} />
				{/each}
			</Layer>
		</Stage>
	{/if}
</div>
