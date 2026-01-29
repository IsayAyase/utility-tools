import type { audioFormats } from "."

export type AudioFormatType = typeof audioFormats[number]

export interface AudioTrimConvertInput {
  buffer: Uint8Array | null
  startTime: number
  endTime: number
  format?: AudioFormatType
}

export interface AudioMergeInput {
  buffers: Uint8Array[]
  format?: AudioFormatType
}

export interface AudioVolumeBoostInput {
  buffer: Uint8Array | null
  volume?: number
  volumeDb?: number
  format?: AudioFormatType
}

export interface AudioFadeInOutInput {
  buffer: Uint8Array | null
  fadeInDuration?: number
  fadeOutDuration?: number
  format?: AudioFormatType
}

export interface AudioSpeedChangeInput {
  buffer: Uint8Array | null
  speed: number
  preservePitch?: boolean
  format?: AudioFormatType
}

export interface AudioReverseInput {
  buffer: Uint8Array | null
  format?: AudioFormatType
}

export interface AudioNormalizeInput {
  buffer: Uint8Array | null
  targetPeak?: number
  format?: AudioFormatType
}
