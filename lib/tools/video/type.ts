export interface VideoTrimInput {
  buffer: Uint8Array
  startTime: number
  endTime: number
}

export interface VideoFormatConvertInput {
  buffer: Uint8Array
  format: 'mp4' | 'webm'
  bitrate?: number
  resolution?: { width: number; height: number }
}
