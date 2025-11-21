import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render #stageContainer', async () => {
		render(Page);

		const container = page.getByTestId('stageContainer');
		await expect.element(container).toBeInTheDocument();
	});
});
