import { test, expect } from 'bun:test';
import { bundle } from '@remotion/bundler';
import { selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

test('bundle and select composition successfully', async () => {
	// Load sample.json for testing
	const sampleJsonPath = path.join(process.cwd(), 'sample.json');
	expect(fs.existsSync(sampleJsonPath)).toBe(true);

	const jsonContent = await Bun.file(sampleJsonPath).text();
	const inputProps = JSON.parse(jsonContent);

	// Bundle the video
	const entryPoint = path.join(process.cwd(), 'src', 'index.ts');
	const bundleLocation = await bundle({
		entryPoint,
	});

	expect(bundleLocation).toBeDefined();
	expect(typeof bundleLocation).toBe('string');

	// Select composition
	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: 'Timeline',
		inputProps,
	});

	expect(composition).toBeDefined();
	expect(composition.id).toBe('Timeline');
	expect(composition.width).toBe(1920);
	expect(composition.height).toBe(1080);
	expect(composition.fps).toBe(30);
	expect(composition.durationInFrames).toBeGreaterThan(0);
}, 30000); // 30 second timeout for bundling
