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
	import { SvelteSet } from 'svelte/reactivity';
	import { browser } from '$app/environment';
	import { CEILING_COMPONENT_TYPES as CEILING_COMPONENTS, CELL_SIZE } from '$lib/constants';
	import type { StageComponent } from '$lib/types';
	import { selectedComponentType, stageConfig } from '$lib/state.svelte';
	import { updateZoom, isWithinBounds } from '$lib/utils/stage';
	import CeilingInvalid from '$lib/components/ceiling-invalid.svelte';
	import CeilingComponent from '$lib/components/ceiling-component.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { CircleX } from '@lucide/svelte';

	let stageContainerEl: HTMLDivElement | null = null;
	let invalidCells = new SvelteSet('');
	let stageComponents = $state<StageComponent[]>([]);
	let componentToDelete = $state('');
	let showDeleteDialog = $state(false);

	let gridLinesHorizontal = $derived(stageConfig.ceilingHeight + 1);
	let gridLinesVertical = $derived(stageConfig.ceilingWidth + 1);

	onMount(() => {
		if (stageContainerEl) {
			stageConfig.dimensions.width = window.innerWidth - 255;
			stageConfig.dimensions.height = window.innerHeight - 64;
		}

		function handleKeyPress(e: KeyboardEvent) {
			// Escape to deselect or close dialog
			if (e.key === 'Escape') {
				if (showDeleteDialog) {
					cancelDelete();
				} else if (selectedComponentType.id) {
					selectedComponentType.id = '';
					selectedComponentType.name = '';
				}
			}
		}

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
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

		if (!isWithinBounds(x, y, stageConfig.ceilingWidth, stageConfig.ceilingHeight)) {
			return;
		}

		const cellCoord = `${x},${y}`;

		if (selectedComponentType.id === CEILING_COMPONENTS.INVALID_AREA.id) {
			if (invalidCells.has(cellCoord)) {
				invalidCells.delete(cellCoord);
			} else {
				invalidCells.add(cellCoord);
			}
		}

		if (
			selectedComponentType.id &&
			selectedComponentType.id !== CEILING_COMPONENTS.INVALID_AREA.id
		) {
			if (!invalidCells.has(cellCoord)) {
				//Check if component already exists at this position
				const exists = stageComponents.some((comp) => comp.x === x && comp.y === y);
				if (exists) return;
				const newComponent = {
					id: crypto.randomUUID(),
					type: selectedComponentType.id,
					x: x,
					y: y
				};
				stageComponents = [...stageComponents, newComponent];
			}
		}
	}

	function handleComponentDragEnd(id: string, finalX: number, finalY: number) {
		if (!isWithinBounds(finalX, finalY, stageConfig.ceilingWidth, stageConfig.ceilingHeight)) {
			return;
		}

		// TODO: fix bug allowing placement on occupied or invalid cells when dragging
		const cellCoord = `${finalX},${finalY}`;
		if (invalidCells.has(cellCoord)) {
			return;
		}

		const exists = stageComponents.some(
			(comp) => comp.id !== id && comp.x === finalX && comp.y === finalY
		);
		if (exists) {
			return;
		}

		// Update component position
		stageComponents = stageComponents.map((comp) =>
			comp.id === id ? { ...comp, x: finalX, y: finalY } : comp
		);
	}

	function handleComponentSelect(id: string) {
		componentToDelete = id;
		showDeleteDialog = true;
	}

	function confirmDelete() {
		stageComponents = stageComponents.filter((comp) => comp.id !== componentToDelete);
		componentToDelete = '';
		showDeleteDialog = false;
	}

	function cancelDelete() {
		componentToDelete = '';
		showDeleteDialog = false;
	}
</script>

<div
	id="stageContainer"
	data-testid="stageContainer"
	bind:this={stageContainerEl}
	class="overflow-hidden bg-gray-100"
	style="cursor: {selectedComponentType.id ? 'crosshair' : 'default'}"
	role="application"
	aria-label="Ceiling design canvas. Click to place components."
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
			onclick={handleStageClick}
			ondragend={(e) => {
				// Only update position if the Stage itself was dragged, not a child component
				if (e.target === e.target.getStage()) {
					const pos = e.target.position();
					stageConfig.position.x = pos.x;
					stageConfig.position.y = pos.y;
				}
			}}
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
					<CeilingComponent
						onSelect={handleComponentSelect}
						onDragEnd={handleComponentDragEnd}
						component={comp}
					/>
				{/each}
			</Layer>
		</Stage>
	{/if}
</div>

<AlertDialog.Root bind:open={showDeleteDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				><CircleX class="mr-2 inline-block text-red-300" />Delete Component</AlertDialog.Title
			>
			<AlertDialog.Description>
				Are you sure you want to delete this component? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={cancelDelete}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmDelete}>Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
