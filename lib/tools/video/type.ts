import { videoFormatList } from "@/lib/tools/video/index"

export type VideoFormatType = typeof videoFormatList[number]

export interface VideoTrimConvertInput {
  buffer: Uint8Array
  format?: VideoFormatType
  bitrate?: number
  resolution?: { width: number; height: number }
  startTime?: number
  endTime?: number
}
