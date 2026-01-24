import type { imageFormatConvertList } from "."

export type ImageFormatType = typeof imageFormatConvertList[number]

export interface ImageFormatConvertInput {
  buffer: Uint8Array | null
  format: ImageFormatType
  quality?: number
  icoSize?: number
}

export interface ImageCompressInput {
  buffer: Uint8Array | null
  quality?: number
  format?: ImageFormatType
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export interface ImageResizeInput {
  buffer: Uint8Array | null
  width: number
  height: number
  maintainAspectRatio?: boolean
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  background?: string
}

export interface ImageCropInput {
  buffer: Uint8Array | null
  left: number
  top: number
  width: number
  height: number
}

export interface ImageRotateInput {
  buffer: Uint8Array | null
  angle: number
  background?: string
  expand?: boolean
}

export interface ImageFlipInput {
  buffer: Uint8Array | null
  direction: 'horizontal' | 'vertical' | 'both'
}

export interface ImageStripExifInput {
  buffer: Uint8Array | null
}

export interface ImageDominantColorInput {
  buffer: Uint8Array | null
  colorCount?: number
  quality?: number
}

export interface DominantColorResult {
  color: string
  palette: string[]
}
