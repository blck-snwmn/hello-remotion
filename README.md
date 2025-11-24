# Hello Remotion

A daily timeline video generator using Remotion.
Takes a JSON file as input and generates a video (`out.mp4` or custom filename).

## Setup

Install dependencies:

```bash
bun install
```

## Usage

1. Prepare a JSON input file (e.g., `sample.json`):

```json
{
  "date": "2024-11-25",
  "videoSettings": {
    "startHour": "09:00",
    "secPerHour": 2
  },
  "tasks": [
    { "time": "09:30", "label": "Morning Meeting" },
    { "time": "11:00", "label": "Development" }
  ]
}
```

2. Run the CLI to generate the video:

```bash
# Default (outputs to out.mp4)
bun run cli.ts sample.json

# Specify output filename
bun run cli.ts sample.json --output holiday.mp4
```

3. The video will be generated with the specified filename (default: `out.mp4`).

## Development

- `src/Timeline.tsx`: Timeline rendering component
- `src/Root.tsx`: Remotion root configuration
- `cli.ts`: CLI script for video generation
