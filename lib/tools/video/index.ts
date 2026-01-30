import { getFFmpegInstance } from '@/store/ffmpeg'
import type { ToolResult } from '../helper'
import type {
  VideoFormatConvertInput,
  VideoTrimInput
} from './type'

export async function videoTrim(input: VideoTrimInput): Promise<ToolResult<Uint8Array>> {
  try {
    const ffmpeg = await getFFmpegInstance()

    await ffmpeg.writeFile('input.mp4', new Uint8Array(input.buffer) as unknown as string)

    const duration = input.endTime - input.startTime
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-ss', input.startTime.toString(),
      '-t', duration.toString(),
      '-c', 'copy',
      'output.mp4'
    ])

    const data = await ffmpeg.readFile('output.mp4')
    ffmpeg.terminate()

    return {
      success: true,
      data: data as Uint8Array,
      metadata: {
        originalSize: input.buffer.length,
        newSize: (data as Uint8Array).length,
        format: 'mp4',
        duration
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to trim video'
    }
  }
}

export async function videoFormatConvert(input: VideoFormatConvertInput): Promise<ToolResult<Uint8Array>> {
  try {
    const ffmpeg = await getFFmpegInstance()

    const extension = input.format === 'mp4' ? 'mp4' : 'webm'
    await ffmpeg.writeFile(`input.${extension}`, new Uint8Array(input.buffer) as unknown as string)

    const args = [
      '-i', `input.${extension}`,
      '-c:v', 'libx264'
    ]

    if (input.resolution) {
      args.push('-vf', `scale=${input.resolution.width}:${input.resolution.height}`)
    }

    if (input.bitrate) {
      args.push('-b:v', `${input.bitrate}k`)
    }

    args.push(`output.${extension}`)

    await ffmpeg.exec(args)

    const data = await ffmpeg.readFile(`output.${extension}`)
    ffmpeg.terminate()

    return {
      success: true,
      data: data as Uint8Array,
      metadata: {
        originalSize: input.buffer.length,
        newSize: (data as Uint8Array).length,
        format: input.format,
        width: input.resolution?.width,
        height: input.resolution?.height
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert video format'
    }
  }
}
