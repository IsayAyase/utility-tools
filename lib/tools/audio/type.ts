export interface AudioTrimInput {
  buffer: Uint8Array
  startTime: number
  endTime: number
}

export interface AudioMergeInput {
  buffers: Uint8Array[]
}

export interface AudioFormatConvertInput {
  buffer: Uint8Array
  format: 'wav'
}

export interface AudioVolumeBoostInput {
  buffer: Uint8Array
  volume?: number
  volumeDb?: number
}

export interface AudioFadeInOutInput {
  buffer: Uint8Array
  fadeInDuration?: number
  fadeOutDuration?: number
}

export interface AudioSpeedChangeInput {
  buffer: Uint8Array
  speed: number
  preservePitch?: boolean
}

export interface AudioReverseInput {
  buffer: Uint8Array
}

export interface AudioNormalizeInput {
  buffer: Uint8Array
  targetPeak?: number
}
