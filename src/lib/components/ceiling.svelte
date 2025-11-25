<script lang="ts">
	import { Rect, Line } from 'svelte-konva';
	let { ceilingWidth, ceilingHeight, cellSize, verticleLines, horizontalLines } = $props();
</script>

<Rect
	x={0}
	y={0}
	width={ceilingWidth * cellSize}
	height={ceilingHeight * cellSize}
	fill="#E2E2D7"
	stroke="#ddd"
	strokeWidth={1}
/>
{#each Array(verticleLines) as _, index (index)}
	<Line
		stroke="#6D8196"
		strokeWidth={1}
		points={[index * cellSize, 0, index * cellSize, ceilingHeight * cellSize]}
		listening={false}
	/>
{/each}
{#each Array(horizontalLines) as _, index (index)}
	<Line
		stroke="#6D8196"
		strokeWidth={1}
		points={[0, index * cellSize, ceilingWidth * cellSize, index * cellSize]}
		listening={false}
	/>
{/each}
