import { toolsArray, type Tool } from "."

export type ToolResult<T = Uint8Array> = {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    originalSize?: number
    newSize?: number
    format?: string
    width?: number
    height?: number
    duration?: number
    pageCount?: number
    [key: string]: unknown
  }
}

export async function fileToBuffer(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

export function bufferToBlob(buffer: Uint8Array, mimeType: string): Blob {
  return new Blob([buffer.buffer as ArrayBuffer], { type: mimeType })
}

export function bufferToBase64(buffer: Uint8Array): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function downloadBuffer(buffer: Uint8Array, filename: string, mimeType: string): void {
  const blob = bufferToBlob(buffer, mimeType)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = "none"
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function bytesToSize(bytes: number): string {
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function parseTimeToSeconds(time: string | number): number {
  if (typeof time === 'number') return time
  if (time.includes(':')) {
    const parts = time.split(':').map(Number)
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    }
  }
  return parseFloat(time) || 0
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function getRelatedToolsByKeywords(Kws: string[], slugToSkip: string | null = null, maxPosts: number = 4): Tool[] {
  const tools = toolsArray
  type ListOfToolsItemWithScore = Tool & { score: number };

  const setOfKws = new Set<string>();
  const toolWithScore = new Array<ListOfToolsItemWithScore>();

  for (const kw of Kws) setOfKws.add(kw);

  for (const tool of tools) {
    if (tool.slug === slugToSkip) continue;
    if (!tool.keywords || tool.keywords.length === 0) continue;

    let score = 0;
    for (const tag of tool.keywords) {
      if (!setOfKws.has(tag)) continue;
      score += 1;
    }

    if (score === 0) continue;
    toolWithScore.push({ ...tool, score });
  }

  toolWithScore.sort((a, b) => b.score - a.score);

  const matchings = new Array<ListOfToolsItemWithScore>();

  for (const post of toolWithScore) {
    matchings.push(post);
    if (matchings.length === maxPosts) break;
  }
  return matchings;
}
