# BladeTools

A privacy-first, browser-based file processing toolkit. All operations run 100% client-side — your files never leave your device.

## Overview

BladeTools is a web application providing a comprehensive suite of tools for processing documents, images, audio, video, and developer utilities. Built with privacy as the core principle, every tool processes files locally in the browser using JavaScript APIs, WebAssembly, and Canvas — no server uploads required.

**Live:** [bladetools.prabhatlabs.dev](https://bladetools.prabhatlabs.dev)

## Features

- **100% Client-Side** — No file uploads, no server processing, no data collection
- **No Sign-Up Required** — Use all tools immediately without registration
- **Offline Capable** — Service worker support for offline usage
- **Dark/Light Mode** — Theme switching with system preference detection
- **Privacy-First** — No tracking, no analytics on file content
- **Free & Open** — All tools available at no cost

## Tool Categories

### Documents

| Tool | Description | Status |
|------|-------------|--------|
| Word to PDF | Convert DOCX to PDF via Mammoth + jsPDF | Done |
| PDF Merge | Combine multiple PDFs using pdf-lib | Done |
| PDF Split | Extract specific pages from PDFs | Done |
| PDF Text Watermark | Add customizable text watermarks | Done |
| PDF Image Watermark | Add image watermarks (PNG, JPEG, WebP) | Done |
| PDF Metadata Editor | Edit/remove document metadata | Testing |
| PDF to Word | Extract text to DOCX | On Hold |
| PDF Compress | Reduce PDF file size | On Hold |

### Images

| Tool | Description | Status |
|------|-------------|--------|
| Image Resize & Format Convert | Resize and convert between JPG, PNG, WebP, ICO | Testing |
| Image to PDF | Convert images to multi-page PDF | Testing |
| Image Transform | Crop, rotate, flip using Canvas API | Testing |
| Image Compress | Reduce image file size | Testing |
| Image Strip EXIF | Remove metadata from images | Testing |
| Image Dominant Color | Extract color palette from images | Testing |

### Audio

| Tool | Description | Status |
|------|-------------|--------|
| Audio Trim & Convert | Cut audio with precision, convert formats | Testing |
| Audio Merge | Combine multiple audio files | Testing |
| Audio Format Convert | Convert to WAV using Web Audio API | Testing |
| Audio Volume Boost | Adjust volume levels | Testing |
| Audio Fade In/Out | Add fade effects | Testing |
| Audio Speed Change | Adjust playback speed | Testing |
| Audio Reverse | Reverse audio playback | Testing |
| Audio Normalize | Normalize audio levels | Testing |

### Video

| Tool | Description | Status |
|------|-------------|--------|
| Video Trim & Convert | Trim and convert video via ffmpeg.wasm | Testing |
| Video Format Convert | Convert between MP4, WebM | Testing |

### Developer Utilities

| Tool | Description | Status |
|------|-------------|--------|
| URL Encoder/Decoder | Encode/decode URL strings | Testing |
| Base64 Encoder/Decoder | Encode/decode Base64 strings | Testing |
| UUID Generator | Generate v4 UUIDs | Testing |
| Lorem Ipsum Generator | Generate placeholder text | Testing |
| JSON to CSV Converter | Convert between JSON and CSV | Testing |
| YAML to JSON | Convert YAML to JSON using js-yaml | Testing |
| Hash Generator | Generate SHA-256/384/512 hashes | Testing |
| Regex Tester | Test regex patterns with real-time matching | Testing |
| Cron Expression Parser | Parse and explain cron expressions | Testing |
| JWT Decoder | Decode JWT token headers and payloads | Testing |

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Radix UI, Tailwind CSS 4 |
| State | Zustand |
| Database | MongoDB via Mongoose |
| Markdown | MDX with next-mdx-remote |
| Animations | Framer Motion |
| Analytics | Vercel Analytics |

### Processing Libraries

| Category | Library |
|----------|---------|
| PDF | pdf-lib |
| Word/DOCX | Mammoth |
| Images | Native Canvas API |
| Audio | Web Audio API |
| Video | ffmpeg.wasm |
| PDF Generation | jsPDF |
| YAML | js-yaml |

### Client-Side Processing Model

All file operations execute entirely in the browser:

1. **User selects file** → File loaded as ArrayBuffer via FileReader
2. **Processing** → Browser APIs (Canvas, Web Audio, WebAssembly) transform data
3. **Output** → Blob created and downloaded — nothing leaves the device

Video tools require ffmpeg.wasm (~25MB initial download). All other tools use native browser capabilities with minimal dependencies.

## Project Structure

```
garlic-tools/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Homepage (hero, categories, FAQ, blog)
│   ├── tools/                  # Tool pages
│   │   ├── page.tsx            # All tools listing
│   │   └── [category]/         # Category pages
│   │       ├── page.tsx        # Category tool listing
│   │       └── [slug]/         # Individual tool pages
│   ├── blogs/                  # Blog listing
│   ├── feedback/               # User feedback
│   ├── privacy-policy/         # Legal pages
│   └── terms-of-service/
├── components/
│   ├── tools/                  # Tool-specific UI components
│   │   ├── document/
│   │   ├── image/
│   │   ├── audio/
│   │   ├── video/
│   │   └── developer/
│   ├── ui/                     # Reusable UI primitives (Radix-based)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ToolCard.tsx
│   └── ...
├── lib/
│   ├── tools/                  # Tool logic (pure functions)
│   │   ├── document/
│   │   ├── image/
│   │   ├── audio/
│   │   ├── video/
│   │   ├── developer/
│   │   ├── index.ts            # Tool registry & metadata
│   │   └── types.ts            # Shared types
│   ├── blogs/
│   │   ├── contents/           # MDX blog posts
│   │   └── index.ts            # Blog utilities
│   ├── db/
│   │   ├── connect.ts          # MongoDB connection
│   │   └── feedback/           # Feedback model
│   └── utils.ts
├── contents/
│   └── mainData.ts             # Site-wide content & metadata
├── store/
│   └── ffmpeg.ts               # Zustand store for ffmpeg state
├── constants/
│   └── envvars.ts              # Environment variable config
├── tools-list.json             # Complete tool specifications
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── prettier.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB instance (for feedback feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/prabhatlabs/garlic-tools.git
cd garlic-tools

# Install dependencies
npm install
# or
bun install
```

### Environment Variables

Create `.env.local` in the project root:

```env
MONGO_URI=mongodb://localhost:27017/blade-tools
```

### Development

```bash
# Start dev server with Turbopack
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Adding a New Tool

1. **Define logic** in `lib/tools/<category>/<tool-name>.ts`
2. **Create UI** in `components/tools/<category>/<tool-name>.tsx`
3. **Register** in `lib/tools/index.ts` under the appropriate category
4. **Add specs** to `tools-list.json`

Each tool returns a `ToolResult<T>` with success status, optional data, error message, and metadata (file size, format, dimensions, etc.).

## Database

MongoDB stores user feedback. The connection module in `lib/db/connect.ts` reuses connections across requests. The feedback model is defined in `lib/db/feedback/`.

## SEO & Metadata

Each page and tool has dedicated metadata (title, description, keywords, Open Graph, Twitter cards) configured in `lib/tools/index.ts` and `contents/mainData.ts`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

Video tools require SharedArrayBuffer support (cross-origin isolation headers).

## License

MIT

## Author

Prabhat Labs — [prabhatlabs.dev](https://prabhatlabs.dev)
