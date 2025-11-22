<script lang="ts">
	import { CEILING_COMPONENT_TYPES, CELL_SIZE } from '$lib/constants';
	import type { StageComponent } from '$lib/types';
	import { Circle, Group, Text } from 'svelte-konva';

	let { component } = $props<{ component: StageComponent }>();
	const componentType =
		CEILING_COMPONENT_TYPES[component.type.toUpperCase() as keyof typeof CEILING_COMPONENT_TYPES];
</script>

<Group x={component.x * CELL_SIZE + CELL_SIZE / 2} y={component.y * CELL_SIZE + CELL_SIZE / 2}>
	<Circle
		x={0}
		y={0}
		radius={CELL_SIZE / 2.5}
		fill={componentType.color}
		stroke="black"
		strokeWidth={2}
		listening={false}
	/>
	<Text x={-8} y={-10} text={componentType.symbol} fontSize={20} fill="black" listening={false} />
</Group>
