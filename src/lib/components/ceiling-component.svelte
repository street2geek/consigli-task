<script lang="ts">
	import { Circle, Group, Path, type KonvaDragTransformEvent } from 'svelte-konva';
	import { CEILING_COMPONENT_TYPES, CELL_SIZE } from '$lib/constants';
	import type { StageComponent } from '$lib/types';

	type CeilingComponentProps = {
		component: StageComponent;
		onDragEnd: (id: string, x: number, y: number) => void;
		onSelect: (id: string) => void;
	};

	let { component, onDragEnd, onSelect }: CeilingComponentProps = $props();
	const componentType =
		CEILING_COMPONENT_TYPES[component.type.toUpperCase() as keyof typeof CEILING_COMPONENT_TYPES];

	function handleDragEnd(e: KonvaDragTransformEvent) {
		e.evt.stopPropagation();
		const pos = e.target.position();
		const finalX = Math.round((pos.x - CELL_SIZE / 2) / CELL_SIZE);
		const finalY = Math.round((pos.y - CELL_SIZE / 2) / CELL_SIZE);

		onDragEnd(component.id, finalX, finalY);
	}
</script>

<Group
	x={component.x * CELL_SIZE + CELL_SIZE / 2}
	y={component.y * CELL_SIZE + CELL_SIZE / 2}
	ondragend={handleDragEnd}
	onclick={() => onSelect(component.id)}
	draggable={true}
>
	<Circle
		x={0}
		y={0}
		radius={CELL_SIZE / 2.5}
		fill={componentType.color}
		stroke="black"
		strokeWidth={2}
	/>
	<Group x={-12} y={-12} scaleX={1} scaleY={1}>
		{#each componentType.svgPaths as pathData}
			<Path data={pathData} fill="black" />
		{/each}
	</Group>
</Group>
