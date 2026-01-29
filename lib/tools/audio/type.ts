import type { audioFormats } from "."

export type AudioFormatType = typeof audioFormats[number]

export interface AudioTrimConvertInput {
  buffer: Uint8Array | null
  startTime: number
  endTime: number
  format?: AudioFormatType
  fadeInDuration?: number
  fadeOutDuration?: number
  speed?: number
  preservePitch?: boolean
}

export interface AudioMergeInput {
  buffers: Uint8Array[]
  format?: AudioFormatType
}
