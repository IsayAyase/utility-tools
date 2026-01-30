import { ToolResult } from "@/lib/tools/types";
import type {
  DominantColorResult,
  ImageConvertResizeReduceInput,
  ImageDominantColorInput,
  ImageToPdfInput,
  ImageTransformInput
} from './type';

export const imageFormatConvertList = ['png', 'jpg', 'jpeg', 'webp', 'ico'] as const
export const imageFitList = ['cover', 'contain', 'fill'] as const
export const pageSizeList = ['A4', 'A3', 'letter', 'legal'] as const
export const flipDirectionList = ['none', 'horizontal', 'vertical', 'both'] as const

export async function imageConvertResizeReduce(
  input: ImageConvertResizeReduceInput
): Promise<ToolResult<Uint8Array>> {
  try {
    if (!input.buffer) throw new Error('No image buffer provided')

    const img = await loadImage(input.buffer)
    let targetWidth = input.width ?? img.width
    let targetHeight = input.height ?? img.height

    if (input.maxWidthOrHeight) {
      const scale = Math.min(
        1,
        input.maxWidthOrHeight / Math.max(targetWidth, targetHeight)
      )
      targetWidth = Math.round(targetWidth * scale)
      targetHeight = Math.round(targetHeight * scale)
    }

    if (input.maintainAspectRatio !== false) {
      const aspect = img.width / img.height

      if (input.width && !input.height) {
        targetHeight = Math.round(input.width / aspect)
      } else if (!input.width && input.height) {
        targetWidth = Math.round(input.height * aspect)
      } else if (input.width && input.height) {
        const inputAspect = input.width / input.height
        if (aspect > inputAspect) {
          targetHeight = Math.round(input.width / aspect)
        } else {
          targetWidth = Math.round(input.height * aspect)
        }
      }
    }

    // ICO special case
    if (input.format === 'ico') {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      const pngBlob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (!pngBlob) throw new Error('Failed to create PNG for ICO')

      const pngBuffer = new Uint8Array(await pngBlob.arrayBuffer())
      const icoBuffer = pngToIco(pngBuffer, targetWidth, targetHeight)

      return {
        success: true,
        data: icoBuffer,
        metadata: {
          originalSize: input.buffer.length,
          newSize: icoBuffer.length,
          format: 'ico',
          width: targetWidth,
          height: targetHeight
        }
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    // background fill (important for jpeg/webp)
    if (input.background) {
      ctx.fillStyle = input.background
      ctx.fillRect(0, 0, targetWidth, targetHeight)
    }

    // Apply fit logic (skiping fill, as it's already handled by default)
    if (input.fit && input.fit !== 'fill') {
      const sourceWidth = img.width
      const sourceHeight = img.height
      const sourceAspect = sourceWidth / sourceHeight
      const targetAspect = targetWidth / targetHeight

      let drawWidth: number, drawHeight: number, drawX: number, drawY: number

      switch (input.fit) {
        case 'cover':
          if (sourceAspect > targetAspect) {
            // Source is wider, use full height
            drawHeight = targetHeight
            drawWidth = targetHeight * sourceAspect
            drawX = (targetWidth - drawWidth) / 2
            drawY = 0
          } else {
            // Source is taller, use full width
            drawWidth = targetWidth
            drawHeight = targetWidth / sourceAspect
            drawX = 0
            drawY = (targetHeight - drawHeight) / 2
          }
          break

        case 'contain':
          if (sourceAspect > targetAspect) {
            // Source is wider, use full width
            drawWidth = targetWidth
            drawHeight = targetWidth / sourceAspect
            drawX = 0
            drawY = (targetHeight - drawHeight) / 2
          } else {
            // Source is taller, use full height
            drawHeight = targetHeight
            drawWidth = targetHeight * sourceAspect
            drawX = (targetWidth - drawWidth) / 2
            drawY = 0
          }
          break

        default:
          drawWidth = targetWidth
          drawHeight = targetHeight
          drawX = 0
          drawY = 0
          break
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    } else {
      // Default fill behavior
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    }

    // export
    const format = input.format ?? 'jpeg'
    const mimeType = `image/${format}`

    const quality =
      format === 'jpeg' || format === 'webp'
        ? (input.quality ?? 80) / 100
        : undefined // ignored for PNG and all others

    let blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, mimeType, quality)
    )

    if (!blob) throw new Error('Failed to process image')

    // maxSizeMB loop (lossy only)
    if (
      input.maxSizeMB &&
      (format === 'jpeg' || format === 'webp')
    ) {
      let q = quality ?? 0.8
      const maxBytes = input.maxSizeMB * 1024 * 1024

      while (blob.size > maxBytes && q > 0.1) {
        q -= 0.1
        blob = await new Promise<Blob | null>(resolve =>
          canvas.toBlob(resolve, mimeType, q)
        )
        if (!blob) break
      }
    }

    if (!blob) {
      return {
        success: false,
        error: 'Failed to process image'
      }
    }
    const arrayBuffer = await blob.arrayBuffer()

    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer.length,
        newSize: arrayBuffer.byteLength,
        format,
        width: targetWidth,
        height: targetHeight
      }
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to process image'
    }
  }
}

export async function imageTransform(input: ImageTransformInput): Promise<ToolResult<Uint8Array>> {
  try {
    if (!input.buffer) throw new Error('No image buffer provided')
    
    const img = await loadImage(input.buffer)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')
    
    // Start with original image dimensions
    let currentWidth = img.width
    let currentHeight = img.height
    canvas.width = currentWidth
    canvas.height = currentHeight
    
    // Apply transformations in order: crop -> rotate -> flip
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) throw new Error('Could not get temporary canvas context')
    
    // Step 1: Start with original image
    tempCanvas.width = img.width
    tempCanvas.height = img.height
    tempCtx.drawImage(img, 0, 0)
    
    // Step 2: Apply crop if specified
    if (input.crop) {
      const { left, top, width, height } = input.crop
      
      // Validate crop dimensions
      if (left < 0 || top < 0 || width <= 0 || height <= 0) {
        throw new Error('Invalid crop dimensions')
      }
      if (left + width > img.width || top + height > img.height) {
        throw new Error('Crop area exceeds image boundaries')
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(tempCanvas, left, top, width, height, 0, 0, width, height)
      
      // Update temp canvas for next transformation
      tempCanvas.width = width
      tempCanvas.height = height
      tempCtx.drawImage(canvas, 0, 0)
      currentWidth = width
      currentHeight = height
    }
    
    // Step 3: Apply rotation if specified
    if (input.rotate) {
      const { angle, background, expand } = input.rotate
      const radians = (angle * Math.PI) / 180
      const cos = Math.abs(Math.cos(radians))
      const sin = Math.abs(Math.sin(radians))
      
      let newWidth: number, newHeight: number
      if (expand !== false) {
        newWidth = Math.round(currentWidth * cos + currentHeight * sin)
        newHeight = Math.round(currentWidth * sin + currentHeight * cos)
      } else {
        newWidth = currentWidth
        newHeight = currentHeight
      }
      
      canvas.width = newWidth
      canvas.height = newHeight
      
      if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, newWidth, newHeight)
      }
      
      ctx.translate(newWidth / 2, newHeight / 2)
      ctx.rotate(radians)
      ctx.drawImage(tempCanvas, -currentWidth / 2, -currentHeight / 2)
      
      // Update temp canvas for next transformation
      tempCanvas.width = newWidth
      tempCanvas.height = newHeight
      tempCtx.drawImage(canvas, 0, 0)
      currentWidth = newWidth
      currentHeight = newHeight
    }
    
    // Step 4: Apply flip if specified
    if (input.flip) {
      const { direction } = input.flip
      
      canvas.width = currentWidth
      canvas.height = currentHeight
      
      ctx.save()
      
      if (direction === 'horizontal' || direction === 'both') {
        ctx.translate(currentWidth, 0)
        ctx.scale(-1, 1)
      }
      if (direction === 'vertical' || direction === 'both') {
        ctx.translate(0, currentHeight)
        ctx.scale(1, -1)
      }
      
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.restore()
    }
    
    const mimeType = `image/${input.format || "png"}`
    const quality = 0.92
    
    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, mimeType, quality)
    })
    
    if (!blob) throw new Error('Failed to transform image')
    
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: new Uint8Array(arrayBuffer),
      metadata: {
        originalSize: input.buffer.length,
        newSize: arrayBuffer.byteLength,
        format: input.format || "png",
        width: canvas.width,
        height: canvas.height,
        transformations: {
          crop: !!input.crop,
          rotate: !!input.rotate,
          flip: !!input.flip
        }
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to transform image'
    }
  }
}

// export async function imageStripExif(input: ImageStripExifInput): Promise<ToolResult<Uint8Array>> {
//   try {
//     const result = await imageCompress({ ...input, format: 'jpeg', quality: 95 })
//     return result
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to strip EXIF data'
//     }
//   }
// }

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

export async function imageToPdf(input: ImageToPdfInput): Promise<ToolResult<Uint8Array>> {
  try {
    if (!input.buffers || input.buffers.length === 0) {
      throw new Error('No image buffers provided')
    }

    const pageSize = input.pageSize || 'A4'
    const margin = input.margin || 20
    const fit = input.fit || 'contain'

    const pageSizes = {
      'A4': { width: 595.28, height: 841.89 },
      'A3': { width: 841.89, height: 1190.55 },
      'letter': { width: 612, height: 792 },
      'legal': { width: 612, height: 1008 }
    }

    const pageDimensions = pageSizes[pageSize]
    const contentWidth = pageDimensions.width - (margin * 2)
    const contentHeight = pageDimensions.height - (margin * 2)

    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: pageSize.toLowerCase(),
      compress: input.compress
    })

    for (let i = 0; i < input.buffers.length; i++) {
      if (i > 0) {
        pdf.addPage()
      }

      const img = await loadImage(input.buffers[i])
      const imgWidth = img.width
      const imgHeight = img.height
      let drawX = margin
      let drawY = margin
      let drawWidth = contentWidth
      let drawHeight = contentHeight

      const imgAspect = imgWidth / imgHeight
      const contentAspect = contentWidth / contentHeight

      switch (fit) {
        case 'contain':
          if (imgAspect > contentAspect) {
            drawHeight = contentWidth / imgAspect
            drawY = margin + (contentHeight - drawHeight) / 2
          } else {
            drawWidth = contentHeight * imgAspect
            drawX = margin + (contentWidth - drawWidth) / 2
          }
          break
        case 'cover':
          if (imgAspect > contentAspect) {
            drawWidth = contentHeight * imgAspect
            drawX = margin - (drawWidth - contentWidth) / 2
          } else {
            drawHeight = contentWidth / imgAspect
            drawY = margin - (drawHeight - contentHeight) / 2
          }
          break
        case 'fill':
          break
      }

      const canvas = document.createElement('canvas')
      canvas.width = drawWidth
      canvas.height = drawHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      ctx.drawImage(img, 0, 0, drawWidth, drawHeight)

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      pdf.addImage(imgData, 'JPEG', drawX, drawY, drawWidth, drawHeight)
    }

    const pdfBytes = pdf.output('arraybuffer')
    return {
      success: true,
      data: new Uint8Array(pdfBytes),
      metadata: {
        originalSize: input.buffers.reduce((sum, buf) => sum + buf.length, 0),
        newSize: pdfBytes.byteLength,
        format: 'pdf',
        pages: input.buffers.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert images to PDF'
    }
  }
}

export function loadImage(buffer: Uint8Array | null): Promise<HTMLImageElement> {
  if (!buffer) throw new Error("Buffer is null")
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    const blob = new Blob([buffer.buffer as ArrayBuffer])
    img.src = URL.createObjectURL(blob)
  })
}

function pngToIco(pngBuffer: Uint8Array, width: number, height: number): Uint8Array {
  const pngSize = pngBuffer.length
  const icoHeader = new ArrayBuffer(6)
  const icoView = new DataView(icoHeader)
  icoView.setUint16(0, 0, true)
  icoView.setUint16(2, 1, true)
  icoView.setUint16(4, 1, true)

  const iconDirEntry = new ArrayBuffer(16)
  const entryView = new DataView(iconDirEntry)
  entryView.setUint8(0, width)
  entryView.setUint8(1, height)
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
