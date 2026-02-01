import { ToolResult } from "@/lib/tools/types";
import { getFFmpegInstance } from '@/store/ffmpeg';
import type {
  VideoTrimConvertInput
} from './type';

export const videoFormatList = ['mp4', 'mp3', 'webm'] as const

export async function videoTrimConvert(input: VideoTrimConvertInput): Promise<ToolResult<Uint8Array>> {
  try {
    const ffmpeg = await getFFmpegInstance()

    const inputExtension = 'mp4' // Default to mp4 for input since most video processing needs video codec
    await ffmpeg.writeFile(`input.${inputExtension}`, new Uint8Array(input.buffer) as unknown as string)

    const args = ['-i', `input.${inputExtension}`]

    // Add trimming if start/end times are provided
    if (input.startTime !== undefined && input.endTime !== undefined) {
      const duration = input.endTime - input.startTime
      args.push('-ss', input.startTime.toString())
      args.push('-t', duration.toString())
    }

    // Add format conversion settings
    if (input.format) {
      if (input.format === 'mp3') {
        args.push('-vn', '-acodec', 'libmp3lame')
      } else {
        args.push('-c:v', 'libx264')
        if (input.format !== 'mp4' && input.format !== 'webm') {
          args.push('-c:a', 'aac')
        }
      }
    }

    // Add resolution scaling if provided (only for video formats)
    if (input.resolution && input.format !== 'mp3') {
      args.push('-vf', `scale=${input.resolution.width}:${input.resolution.height}`)
    }

    // Add bitrate if provided
    if (input.bitrate) {
      if (input.format === 'mp3') {
        args.push('-b:a', `${input.bitrate}k`)
      } else {
        args.push('-b:v', `${input.bitrate}k`)
      }
    }

    // Use copy codec if only trimming without format conversion
    if (!input.format && input.startTime !== undefined && input.endTime !== undefined) {
      args.push('-c', 'copy')
    }

    const outputExtension = input.format || inputExtension
    args.push(`output.${outputExtension}`)

    await ffmpeg.exec(args)

    const data = await ffmpeg.readFile(`output.${outputExtension}`)

    return {
      success: true,
      data: data as Uint8Array,
      metadata: {
        originalSize: input.buffer.length,
        newSize: (data as Uint8Array).length,
        format: outputExtension,
        width: input.resolution?.width,
        height: input.resolution?.height,
        duration: input.startTime !== undefined && input.endTime !== undefined ? input.endTime - input.startTime : undefined
      }
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process video'
    }
  }
}

export async function addSubtitleToVideo(input: VideoTrimConvertInput & { subtitleExtension?: string; subtitleBuffer?: Uint8Array }): Promise<ToolResult<Uint8Array>> {
  try {
    const ffmpeg = await getFFmpegInstance()

    const extension = input.format === 'mp4' || !input.format ? 'mp4' : 'webm'
    await ffmpeg.writeFile(`input.${extension}`, new Uint8Array(input.buffer) as unknown as string)

    // Determine subtitle file extension
    const subtitleExt = input.subtitleExtension || 'srt'

    // Write subtitle file to FFmpeg virtual file system
    if (input.subtitleBuffer) {
      await ffmpeg.writeFile(`subtitle.${subtitleExt}`, input.subtitleBuffer as unknown as string)
    }

    // Add subtitle processing - burn subtitles into video (hardcode them)
    const args = [
      '-i', `input.${extension}`,
      '-i', `subtitle.${subtitleExt}`,
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-preset', 'fast',
      '-crf', '23',
      '-vf', `subtitles=subtitle.${subtitleExt}`, // Burn subtitles into video
      `output.${extension}`
    ]

    await ffmpeg.exec(args)

    const data = await ffmpeg.readFile(`output.${extension}`)

    return {
      success: true,
      data: data as Uint8Array,
      metadata: {
        originalSize: input.buffer.length,
        newSize: (data as Uint8Array).length,
        format: input.format
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to burn subtitle to video'
    }
  }
}