import { test, expect } from "bun:test";
import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";
import path from "path";

test("bundle and select composition successfully", async () => {
	// Bundle the video
	const entryPoint = path.join(process.cwd(), "src", "index.ts");
	const bundleLocation = await bundle({
		entryPoint,
	});

	expect(bundleLocation).toBeDefined();
	expect(typeof bundleLocation).toBe("string");

	// Select composition (01-BasicAnimation)
	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: "01-BasicAnimation",
	});

	expect(composition).toBeDefined();
	expect(composition.id).toBe("01-BasicAnimation");
	expect(composition.width).toBe(1920);
	expect(composition.height).toBe(1080);
	expect(composition.fps).toBe(30);
	expect(composition.durationInFrames).toBeGreaterThan(0);
}, 30000); // 30 second timeout for bundling
