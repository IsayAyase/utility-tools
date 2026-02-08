import type { flipDirectionList, imageFitList, imageFormatConvertList, pageSizeList } from "."

export type ImageFormatType = typeof imageFormatConvertList[number]
export type ImageFitType = typeof imageFitList[number]
export type ImageDirectionType = typeof flipDirectionList[number]

export interface ImageConvertResizeReduceInput {
  buffer: Uint8Array | null

  /* ---------- format / compression ---------- */
  format?: ImageFormatType
  quality?: number

  /* ---------- resize ---------- */
  width?: number
  height?: number
  maintainAspectRatio?: boolean
  fit?: ImageFitType
  background?: string

  /* ---------- constraints ---------- */
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export interface ImageTransformInput {
  buffer: Uint8Array | null
  format?: ImageFormatType
  
  // Crop parameters
  crop?: {
    left: number
    top: number
    right: number
    bottom: number
  }
  
  // Rotate parameters
  rotate?: {
    angle: number
    background?: string
    expand?: boolean
  }
  
  // Flip parameters
  flip?: {
    direction: ImageDirectionType
  }
}

export interface ImageStripExifInput {
  buffer: Uint8Array | null
}

export interface ImageDominantColorInput {
  buffer: Uint8Array | null
  colorCount?: number
  quality?: number
}

export type PageSizeType = typeof pageSizeList[number]

export interface ImageToPdfInput {
  buffers: Uint8Array[]
  pageSize?: PageSizeType
  fit?: ImageFitType
  margin?: number
}

export interface DominantColorResult {
  color: string
  palette: string[]
}
