<script lang="ts">
	import { Rect } from 'svelte-konva';

	let { coords, width, height, fill = 'rgba(255, 0, 0, 0.5)' } = $props();
	const [x, y] = coords;
</script>

<Rect {x} {y} {width} {height} {fill} listening={false} />
