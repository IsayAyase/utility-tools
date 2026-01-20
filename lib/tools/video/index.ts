import type { ToolResult } from '../helper'
import type {
  VideoTrimInput,
  VideoFormatConvertInput
} from './type'

export async function videoTrim(input: VideoTrimInput): Promise<ToolResult<Uint8Array>> {
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    
    const ffmpeg = new FFmpeg()
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
    
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
    await ffmpeg.terminate()
    
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
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
    
    const ffmpeg = new FFmpeg()
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })
    
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
    await ffmpeg.terminate()
    
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
