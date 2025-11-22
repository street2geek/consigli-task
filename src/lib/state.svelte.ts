export const stageConfig = $state({
	ceilingWidth: 25,
	ceilingHeight: 20,
	position: { x: 64, y: 64 },
	zoom: 1,
	dimensions: { width: 1024, height: 768 }
});

export const selectedComponent = $state({
	id: '',
	name: ''
});
