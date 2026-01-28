export interface AudioTrimInput {
  buffer: Uint8Array
  startTime: number
  endTime: number
  format?: string
}

export interface AudioMergeInput {
  buffers: Uint8Array[]
  format?: string
}

export interface AudioFormatConvertInput {
  buffer: Uint8Array
  format: 'wav' | 'mp3' | 'ogg' | 'flac' | 'm4a'
}

export interface AudioVolumeBoostInput {
  buffer: Uint8Array
  volume?: number
  volumeDb?: number
  format?: string
}

export interface AudioFadeInOutInput {
  buffer: Uint8Array
  fadeInDuration?: number
  fadeOutDuration?: number
  format?: string
}

export interface AudioSpeedChangeInput {
  buffer: Uint8Array
  speed: number
  preservePitch?: boolean
  format?: string
}

export interface AudioReverseInput {
  buffer: Uint8Array
  format?: string
}

export interface AudioNormalizeInput {
  buffer: Uint8Array
  targetPeak?: number
  format?: string
}
