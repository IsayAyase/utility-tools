export interface ImageFormatConvertInput {
  buffer: Uint8Array
  format: 'jpeg' | 'png' | 'webp' | 'ico'
  quality?: number
  icoSize?: number
}

export interface ImageCompressInput {
  buffer: Uint8Array
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export interface ImageResizeInput {
  buffer: Uint8Array
  width: number
  height: number
  maintainAspectRatio?: boolean
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  background?: string
}

export interface ImageCropInput {
  buffer: Uint8Array
  left: number
  top: number
  width: number
  height: number
}

export interface ImageRotateInput {
  buffer: Uint8Array
  angle: number
  background?: string
  expand?: boolean
}

export interface ImageFlipInput {
  buffer: Uint8Array
  direction: 'horizontal' | 'vertical' | 'both'
}

export interface ImageStripExifInput {
  buffer: Uint8Array
}

export interface ImageDominantColorInput {
  buffer: Uint8Array
  colorCount?: number
  quality?: number
}

export interface DominantColorResult {
  color: string
  palette: string[]
}
