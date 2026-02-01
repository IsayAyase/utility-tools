export interface GetPdfInfoInput {
  buffer: Uint8Array
}

export interface GetPdfInfoOutput {
  file: {
    size: number
    pageCount: number
  }
  metadata: {
    title?: string
    author?: string
    subject?: string
    keywords?: string[]
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
  }
  indices: number[]
  pages: Array<{
    index: number
    width: number
    height: number
    rotation: number
    widthMm: number
    heightMm: number
  }>
  fonts: string[]
}

export interface WordToPdfInput {
  buffer: Uint8Array | null
  compress?: boolean
}

export interface PdfMergeInput {
  buffers: Uint8Array[]
}

export interface PdfSplitInput {
  buffer: Uint8Array | null
  pages?: number[]
}

export interface PdfAddTextWatermarkInput {
  buffer: Uint8Array | null
  text: string
  fontSize?: number
  opacity?: number
  rotation?: number
  color?: string
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'center-left' | 'center-right'
}

export interface PdfAddImageWatermarkInput {
  buffer: Uint8Array | null
  watermarkBuffer: Uint8Array | null
  opacity?: number
  rotation?: number
  scale?: number
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center' | 'center-left' | 'center-right'
}

export interface PdfMetadataUpdaterInput {
  buffer: Uint8Array | null,
  title?: string,
  author?: string,
  subject?: string,
  keywords?: string[],
  creator?: string,
  producer?: string,
  creationDate?: Date,
  modificationDate?: Date
}
