import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { parseArgs } from 'util';

const main = async () => {
    const { values: options, positionals: args } = parseArgs({
        args: process.argv.slice(2),
        options: {
            output: {
                type: 'string',
                short: 'o',
            },
        },
        strict: true,
        allowPositionals: true,
    });

    if (args.length === 0) {
        console.error('Usage: bun run cli.ts <json-file> [--output <output-file>]');
        process.exit(1);
    }

    const jsonPath = args[0];
    if (!jsonPath || !fs.existsSync(jsonPath)) {
        console.error(`File not found: ${jsonPath}`);
        process.exit(1);
    }

    const jsonContent = await Bun.file(jsonPath).text();
    const inputProps = JSON.parse(jsonContent);

    console.log('Bundling video...');
    const entryPoint = path.join(process.cwd(), 'src', 'index.ts');

    const bundleLocation = await bundle({
        entryPoint,
    });

    console.log('Selecting composition...');
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'Timeline',
        inputProps,
    });

    console.log('Rendering video...');
    const outputLocation = options.output
        ? path.resolve(process.cwd(), options.output)
        : path.join(process.cwd(), 'out.mp4');

    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation,
        inputProps,
    });

    console.log(`Video rendered to ${outputLocation}`);
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
