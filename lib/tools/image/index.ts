import type { ToolResult } from '../helper'
import type {
  DominantColorResult,
  ImageCompressInput,
  ImageCropInput,
  ImageDominantColorInput,
  ImageFlipInput,
  ImageFormatConvertInput,
  ImageResizeInput,
  ImageRotateInput,
  ImageStripExifInput
} from './type'

export const imageFormatConvertList = ['png', 'jpg', 'jpeg', 'webp', 'ico'] as const

export async function imageFormatConvert(input: ImageFormatConvertInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    ctx.drawImage(img, 0, 0)
    
    if (input.format === 'ico') {
      const targetSize = input.icoSize || 32
      const iconCanvas = document.createElement('canvas')
      iconCanvas.width = targetSize
      iconCanvas.height = targetSize
      const iconCtx = iconCanvas.getContext('2d')
      if (!iconCtx) throw new Error('Could not get canvas context')
      
      iconCtx.drawImage(img, 0, 0, targetSize, targetSize)
      
      const pngBlob = await new Promise<Blob | null>(resolve => {
        iconCanvas.toBlob(resolve, 'image/png')
      })
      
      if (!pngBlob) throw new Error('Failed to create PNG for ICO')
      
      const pngBuffer = new Uint8Array(await pngBlob.arrayBuffer())
      const icoBuffer = pngToIco(pngBuffer, targetSize)
      
      return {
        success: true,
        data: icoBuffer,
        metadata: {
          originalSize: input.buffer?.length || 0,
          newSize: icoBuffer.length,
          format: 'ico',
          width: targetSize,
          height: targetSize
        }
      }
    }
    
    const mimeType = `image/${input.format}`
    const quality = input.quality !== undefined ? input.quality / 100 : 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to convert image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: input.format,
        width: img.width,
        height: img.height
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert image format'
    }
  }
}

export async function imageCompress(input: ImageCompressInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    ctx.drawImage(img, 0, 0)
    
    const mimeType = input.format ? `image/${input.format}` : 'image/jpeg'
    const quality = input.quality !== undefined ? input.quality / 100 : 0.8
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to compress image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: input.format || 'jpeg',
        width: img.width,
        height: img.height
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compress image'
    }
  }
}

export async function imageResize(input: ImageResizeInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    let newWidth = input.width
    let newHeight = input.height
    
    if (input.maintainAspectRatio !== false) {
      const aspectRatio = img.width / img.height
      const inputAspect = input.width / input.height
      if (aspectRatio > inputAspect) {
        newHeight = Math.round(input.width / aspectRatio)
      } else {
        newWidth = Math.round(input.height * aspectRatio)
      }
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    if (input.background) {
      ctx.fillStyle = input.background
      ctx.fillRect(0, 0, newWidth, newHeight)
    }
    
    ctx.drawImage(img, 0, 0, newWidth, newHeight)
    
    const mimeType = 'image/png'
    const quality = 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to resize image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: 'png',
        width: newWidth,
        height: newHeight
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resize image'
    }
  }
}

export async function imageCrop(input: ImageCropInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    
    const canvas = document.createElement('canvas')
    canvas.width = input.width
    canvas.height = input.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    ctx.drawImage(img, input.left, input.top, input.width, input.height, 0, 0, input.width, input.height)
    
    const mimeType = 'image/png'
    const quality = 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to crop image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: 'png',
        width: input.width,
        height: input.height
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to crop image'
    }
  }
}

export async function imageRotate(input: ImageRotateInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    
    const radians = (input.angle * Math.PI) / 180
    const cos = Math.abs(Math.cos(radians))
    const sin = Math.abs(Math.sin(radians))
    
    let newWidth: number, newHeight: number
    if (input.expand !== false) {
      newWidth = Math.round(img.width * cos + img.height * sin)
      newHeight = Math.round(img.width * sin + img.height * cos)
    } else {
      newWidth = img.width
      newHeight = img.height
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    if (input.background) {
      ctx.fillStyle = input.background
      ctx.fillRect(0, 0, newWidth, newHeight)
    }
    
    ctx.translate(newWidth / 2, newHeight / 2)
    ctx.rotate(radians)
    ctx.drawImage(img, -img.width / 2, -img.height / 2)
    
    const mimeType = 'image/png'
    const quality = 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to rotate image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: 'png',
        width: newWidth,
        height: newHeight
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to rotate image'
    }
  }
}

export async function imageFlip(input: ImageFlipInput): Promise<ToolResult<Uint8Array>> {
  try {
    const img = await loadImage(input.buffer)
    
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    if (input.direction === 'horizontal' || input.direction === 'both') {
      ctx.translate(img.width, 0)
      ctx.scale(-1, 1)
    }
    if (input.direction === 'vertical' || input.direction === 'both') {
      ctx.translate(0, img.height)
      ctx.scale(1, -1)
    }
    
    ctx.drawImage(img, 0, 0)
    
    const mimeType = 'image/png'
    const quality = 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to flip image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer?.length || 0,
        newSize: arrayBuffer.byteLength,
        format: 'png',
        width: img.width,
        height: img.height
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to flip image'
    }
  }
}

export async function imageStripExif(input: ImageStripExifInput): Promise<ToolResult<Uint8Array>> {
  try {
    const result = await imageCompress({ ...input, format: 'jpeg', quality: 95 })
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to strip EXIF data'
    }
  }
}

export async function imageDominantColor(input: ImageDominantColorInput): Promise<ToolResult<DominantColorResult>> {
  try {
    const img = await loadImage(input.buffer)
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    ctx.drawImage(img, 0, 0, 100, 100)
    const imageData = ctx.getImageData(0, 0, 100, 100)
    const data = imageData.data
    
    const colorCounts: Record<string, number> = {}
    let maxCount = 0
    let dominantColor = '#000000'
    
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / 32) * 32
      const g = Math.floor(data[i + 1] / 32) * 32
      const b = Math.floor(data[i + 2] / 32) * 32
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      colorCounts[hex] = (colorCounts[hex] || 0) + 1
      
      if (colorCounts[hex] > maxCount) {
        maxCount = colorCounts[hex]
        dominantColor = hex
      }
    }
    
    const palette = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color)
    
    return {
      success: true,
      data: { color: dominantColor, palette },
      metadata: {
        originalSize: input.buffer?.length || 0,
        format: 'dominant-color'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract dominant color'
    }
  }
}

function loadImage(buffer: Uint8Array | null): Promise<HTMLImageElement> {
  if (!buffer) throw new Error("Buffer is null")
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    const blob = new Blob([buffer.buffer as ArrayBuffer])
    img.src = URL.createObjectURL(blob)
  })
}

function pngToIco(pngBuffer: Uint8Array, size: number): Uint8Array {
  const pngSize = pngBuffer.length
  const icoHeader = new ArrayBuffer(6)
  const icoView = new DataView(icoHeader)
  icoView.setUint16(0, 0, true)
  icoView.setUint16(2, 1, true)
  icoView.setUint16(4, 1, true)
  
  const iconDirEntry = new ArrayBuffer(16)
  const entryView = new DataView(iconDirEntry)
  entryView.setUint8(0, size)
  entryView.setUint8(1, size)
  entryView.setUint8(2, 0)
  entryView.setUint8(3, 0)
  entryView.setUint16(4, 1, true)
  entryView.setUint16(6, 32, true)
  entryView.setUint32(8, pngSize + 16, true)
  entryView.setUint32(12, 22, true)
  
  const icoBuffer = new ArrayBuffer(6 + 16 + pngSize)
  const icoArray = new Uint8Array(icoBuffer)
  icoArray.set(new Uint8Array(icoHeader), 0)
  icoArray.set(new Uint8Array(iconDirEntry), 6)
  icoArray.set(pngBuffer, 22)
  
  return new Uint8Array(icoBuffer)
}