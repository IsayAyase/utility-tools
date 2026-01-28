import type { ToolResult } from '../helper'
import type {
  AudioFadeInOutInput,
  AudioFormatConvertInput,
  AudioMergeInput,
  AudioNormalizeInput,
  AudioReverseInput,
  AudioSpeedChangeInput,
  AudioTrimInput,
  AudioVolumeBoostInput
} from './type'

let ffmpegInstance: any = null

export async function audioTrim(input: AudioTrimInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const startSample = Math.floor(input.startTime * audioBuffer.sampleRate)
    const endSample = Math.floor(input.endTime * audioBuffer.sampleRate)
    const length = endSample - startSample

    if (length <= 0) {
      return { success: false, error: 'Invalid time range' }
    }

    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        newData[i] = oldData[startSample + i]
      }
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    console.log(error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to trim audio'
    }
  }
}

export async function audioMerge(input: AudioMergeInput): Promise<ToolResult<Uint8Array>> {
  try {
    if (input.buffers.length < 2) {
      return { success: false, error: 'At least 2 audio files required for merging' }
    }

    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const decodedBuffers: AudioBuffer[] = []
    let totalLength = 0
    let sampleRate = 44100
    let numChannels = 2

    for (const buffer of input.buffers) {
      const audioBuffer = await audioContext.decodeAudioData(buffer.buffer as ArrayBuffer)
      decodedBuffers.push(audioBuffer)
      totalLength += audioBuffer.length
      sampleRate = audioBuffer.sampleRate
      numChannels = Math.max(numChannels, audioBuffer.numberOfChannels)
    }

    const newBuffer = audioContext.createBuffer(numChannels, totalLength, sampleRate)

    let offset = 0
    for (const audioBuffer of decodedBuffers) {
      for (let channel = 0; channel < numChannels; channel++) {
        const newChannelData = newBuffer.getChannelData(channel)
        const oldChannelData = audioBuffer.getChannelData(Math.min(channel, audioBuffer.numberOfChannels - 1))
        for (let i = 0; i < audioBuffer.length; i++) {
          newChannelData[offset + i] = oldChannelData[i]
        }
      }
      offset += audioBuffer.length
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffers.reduce((sum, b) => sum + b.length, 0),
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: totalLength / sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to merge audio'
    }
  }
}

export async function audioFormatConvert(input: AudioFormatConvertInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const outputBuffer = await encodeAudioBuffer(audioBuffer, input.format)

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: input.format,
        duration: audioBuffer.length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert audio format'
    }
  }
}

export async function audioVolumeBoost(input: AudioVolumeBoostInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    let gainValue = input.volume || 1
    if (input.volumeDb !== undefined) {
      gainValue = Math.pow(10, input.volumeDb / 20)
    }

    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)
      for (let i = 0; i < audioBuffer.length; i++) {
        newData[i] = Math.max(-1, Math.min(1, oldData[i] * gainValue))
      }
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: audioBuffer.length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to adjust volume'
    }
  }
}

export async function audioFadeInOut(input: AudioFadeInOutInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const fadeInSamples = Math.floor((input.fadeInDuration || 0) * audioBuffer.sampleRate)
    const fadeOutSamples = Math.floor((input.fadeOutDuration || 0) * audioBuffer.sampleRate)

    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)

      for (let i = 0; i < audioBuffer.length; i++) {
        let gain = 1

        if (i < fadeInSamples && fadeInSamples > 0) {
          gain *= i / fadeInSamples
        }

        if (i >= audioBuffer.length - fadeOutSamples && fadeOutSamples > 0) {
          gain *= (audioBuffer.length - i) / fadeOutSamples
        }

        newData[i] = oldData[i] * gain
      }
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: audioBuffer.length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add fade effects'
    }
  }
}

export async function audioSpeedChange(input: AudioSpeedChangeInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const playbackRate = input.speed
    const outputFormat = input.format || 'wav'
    let newBuffer: AudioBuffer

    if (input.preservePitch) {
      const newLength = Math.floor(audioBuffer.length / playbackRate)
      newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        newLength,
        audioBuffer.sampleRate
      )

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const oldData = audioBuffer.getChannelData(channel)
        const newData = newBuffer.getChannelData(channel)
        for (let i = 0; i < newLength; i++) {
          newData[i] = oldData[Math.floor(i * playbackRate)]
        }
      }
    } else {
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        Math.floor(audioBuffer.length / playbackRate),
        audioBuffer.sampleRate
      )

      const source = offlineContext.createBufferSource()
      source.buffer = audioBuffer
      source.playbackRate.value = playbackRate
      source.connect(offlineContext.destination)
      source.start()

      newBuffer = await offlineContext.startRendering()
    }

    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: audioBuffer.length / audioBuffer.sampleRate / playbackRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to change audio speed'
    }
  }
}

export async function audioReverse(input: AudioReverseInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)
      for (let i = 0; i < audioBuffer.length; i++) {
        newData[i] = oldData[audioBuffer.length - 1 - i]
      }
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: audioBuffer.length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reverse audio'
    }
  }
}

export async function audioNormalize(input: AudioNormalizeInput): Promise<ToolResult<Uint8Array>> {
  try {
    const audioBuffer = await decodeAudio(input.buffer)
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const targetPeak = input.targetPeak || 0.95
    let maxSample = 0

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const data = audioBuffer.getChannelData(channel)
      for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i])
        if (abs > maxSample) maxSample = abs
      }
    }

    const gain = maxSample > 0 ? targetPeak / maxSample : 1

    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const oldData = audioBuffer.getChannelData(channel)
      const newData = newBuffer.getChannelData(channel)
      for (let i = 0; i < audioBuffer.length; i++) {
        newData[i] = Math.max(-1, Math.min(1, oldData[i] * gain))
      }
    }

    const outputFormat = input.format || 'wav'
    const outputBuffer = await encodeAudioBuffer(newBuffer, outputFormat)
    await audioContext.close()

    return {
      success: true,
      data: outputBuffer,
      metadata: {
        originalSize: input.buffer.length,
        newSize: outputBuffer.length,
        format: outputFormat,
        duration: audioBuffer.length / audioBuffer.sampleRate
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to normalize audio'
    }
  }
}


async function getFFmpeg() {
  if (!ffmpegInstance) {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    ffmpegInstance = new FFmpeg()
    
    try {
      await ffmpegInstance.load()
    } catch (error) {
      console.error('Failed to load FFmpeg:', error)
      throw new Error('Failed to initialize FFmpeg')
    }
  }
  return ffmpegInstance
}

async function encodeAudioBuffer(audioBuffer: AudioBuffer, format: string): Promise<Uint8Array> {
  // First convert to WAV
  const wavBuffer = audioBufferToWav(audioBuffer)
  
  if (format === 'wav') {
    return wavBuffer
  }
  
  try {
    // Use FFmpeg to convert to other formats
    const ffmpeg = await getFFmpeg()
    
    // Ensure clean state
    try {
      await ffmpeg.deleteFile('input.wav')
      await ffmpeg.deleteFile('output.wav')
      await ffmpeg.deleteFile('output.mp3')
      await ffmpeg.deleteFile('output.ogg')
      await ffmpeg.deleteFile('output.flac')
      await ffmpeg.deleteFile('output.m4a')
    } catch {
      // Ignore errors when cleaning up non-existent files
    }
    
    // Write input WAV file
    await ffmpeg.writeFile('input.wav', wavBuffer)
    
    // Determine output codec and extension
    const outputExt = format === 'm4a' ? 'm4a' : format
    const outputName = `output.${outputExt}`
    
    // Build FFmpeg command based on format
    let command = ['-i', 'input.wav']
    
    switch (format) {
      case 'mp3':
        command.push('-codec:a', 'libmp3lame', '-qscale:a', '2')
        break
      case 'ogg':
        command.push('-codec:a', 'libvorbis')
        break
      case 'flac':
        command.push('-codec:a', 'flac')
        break
      case 'm4a':
        command.push('-codec:a', 'aac')
        break
      default:
        return wavBuffer // Fallback to WAV
    }
    
    command.push(outputName)
    
    // Execute conversion
    try {
      await ffmpeg.exec(command)
    } catch (error) {
      console.error('FFmpeg execution failed:', error)
      throw new Error(`Failed to convert to ${format}: ${error}`)
    }
    
    // Read output file
    try {
      const outputData = await ffmpeg.readFile(outputName)
      
      // Clean up files
      try {
        await ffmpeg.deleteFile('input.wav')
        await ffmpeg.deleteFile(outputName)
      } catch {
        // Ignore cleanup errors
      }
      
      return new Uint8Array(outputData as ArrayBuffer)
    } catch (error) {
      console.error('Failed to read output file:', error)
      throw new Error(`Failed to read converted ${format} file`)
    }
  } catch (error) {
    console.error('Encoding failed:', error)
    // Fallback to WAV if FFmpeg fails
    console.log('Falling back to WAV format')
    return wavBuffer
  }
}

export function audioBufferToWav(buffer: AudioBuffer): Uint8Array {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample

  const dataLength = buffer.length * blockAlign
  const bufferLength = 44 + dataLength

  const arrayBuffer = new ArrayBuffer(bufferLength)
  const view = new DataView(arrayBuffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, bufferLength - 8, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataLength, true)

  const channels: Float32Array[] = []
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  let offset = 44
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }

  return new Uint8Array(arrayBuffer)
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

async function decodeAudio(buffer: Uint8Array): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  
  // Create a fresh copy of the ArrayBuffer to avoid detached buffer issues
  const arrayBuffer = buffer.slice().buffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  await audioContext.close()
  return audioBuffer
}