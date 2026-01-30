import { ToolResult } from "@/lib/tools/types";
import { degrees, PDFDocument, rgb, StandardFonts, type Color } from 'pdf-lib';
import type {
    GetPdfInfoInput,
    GetPdfInfoOutput,
    PdfAddImageWatermarkInput,
    PdfAddTextWatermarkInput,
    PdfMergeInput,
    PdfMetadataUpdaterInput,
    PdfSplitInput,
    WordToPdfInput
} from './type';

export async function getPdfInfo(
    input: GetPdfInfoInput
): Promise<ToolResult<GetPdfInfoOutput>> {
    try {
        const pdfDoc = await PDFDocument.load(input.buffer, { ignoreEncryption: true })

        const pages = pdfDoc.getPages()

        const pageData = pages.map((page, index) => {
            const { width, height } = page.getSize()
            const rotation = page.getRotation().angle

            return {
                index,
                width,
                height,
                rotation,
                widthMm: width * 0.3527,
                heightMm: height * 0.3527
            }
        })

        // Metadata
        const metadata = {
            title: pdfDoc.getTitle() || undefined,
            author: pdfDoc.getAuthor() || undefined,
            subject: pdfDoc.getSubject() || undefined,
            keywords: pdfDoc.getKeywords()?.split(',').map(k => k.trim()),
            creator: pdfDoc.getCreator() || undefined,
            producer: pdfDoc.getProducer() || undefined,
            creationDate: pdfDoc.getCreationDate()?.toISOString(),
            modificationDate: pdfDoc.getModificationDate()?.toISOString()
        }

        // Fonts (best-effort)
        const fontSet = new Set<string>()
        pages.forEach(page => {
            const resources = (page as any).node.Resources?.Font
            if (resources) {
                Object.values(resources).forEach((font: any) => {
                    const baseName = font?.BaseFont?.name
                    if (baseName) fontSet.add(baseName)
                })
            }
        })

        return {
            success: true,
            data: {
                file: {
                    size: input.buffer.length,
                    pageCount: pages.length
                },
                metadata,
                pages: pageData,
                indices: pdfDoc.getPageIndices(),
                fonts: Array.from(fontSet)
            }
        }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to extract PDF information'
        }
    }
}

export async function wordToPdf(input: WordToPdfInput): Promise<ToolResult<Uint8Array>> {
    try {
        if (!input.buffer) throw new Error('No buffer!')

        const mammoth = (await import('mammoth')).default || await import('mammoth')
        const { jsPDF } = await import('jspdf')
        const JSZip = (await import('jszip')).default

        // Convert Uint8Array to ArrayBuffer
        const arrayBuffer = input.buffer.buffer.slice(
            input.buffer.byteOffset,
            input.buffer.byteOffset + input.buffer.byteLength
        ) as ArrayBuffer

        // Unzip the .docx to extract images and relationships
        const zip = await JSZip.loadAsync(arrayBuffer)

        // Extract all images from word/media/
        const imageMap = new Map<string, string>()
        const mediaFiles = Object.keys(zip.files).filter(name => name.startsWith('word/media/'))

        for (const filename of mediaFiles) {
            const file = zip.file(filename)
            if (file) {
                const imageData = await file.async('base64')
                const imageName = filename.split('/').pop() || ''

                let mimeType = 'image/jpeg'
                if (imageName.endsWith('.png')) mimeType = 'image/png'
                else if (imageName.endsWith('.gif')) mimeType = 'image/gif'
                else if (imageName.endsWith('.bmp')) mimeType = 'image/bmp'

                imageMap.set(imageName, `data:${mimeType};base64,${imageData}`)
            }
        }

        // Parse relationship map
        const relsXml = await zip.file('word/_rels/document.xml.rels')?.async('text')
        const relMap = new Map<string, string>()

        if (relsXml) {
            const relMatches = relsXml.matchAll(/Relationship Id="(rId\d+)".*?Target="media\/([^"]+)"/g)
            for (const match of relMatches) {
                relMap.set(match[1], match[2])
            }
        }

        // Parse document.xml for structure
        const documentXml = await zip.file('word/document.xml')?.async('text')

        // Extract image positions and sizes from document.xml
        const imagePositions = new Map<string, { width?: number, height?: number, index: number }>()
        if (documentXml) {
            let imgIndex = 0
            const drawingMatches = documentXml.matchAll(/<w:drawing>[\s\S]*?<a:blip r:embed="(rId\d+)"[\s\S]*?<\/w:drawing>/g)

            for (const match of drawingMatches) {
                const rId = match[1]
                const drawingXml = match[0]

                // Extract width and height in EMUs (English Metric Units)
                const widthMatch = drawingXml.match(/<wp:extent cx="(\d+)"/)
                const heightMatch = drawingXml.match(/cy="(\d+)"/)

                const width = widthMatch ? parseInt(widthMatch[1]) / 9525 : undefined // Convert EMU to mm
                const height = heightMatch ? parseInt(heightMatch[1]) / 9525 : undefined

                const imageName = relMap.get(rId)
                if (imageName) {
                    imagePositions.set(imageName, { width, height, index: imgIndex })
                }
                imgIndex++
            }
        }

        // Convert to HTML with better options
        const result = await mammoth.convertToHtml({
            arrayBuffer: arrayBuffer
        })

        let htmlContent = result.value.trim()

        // Inject images at proper positions
        if (documentXml) {
            const paragraphs = htmlContent.split(/<\/p>/g).filter(p => p.trim())
            const newParagraphs: string[] = []
            let imgCounter = 0

            for (let i = 0; i < paragraphs.length; i++) {
                newParagraphs.push(paragraphs[i] + '</p>')

                // Check if there's an image that should appear after this paragraph
                // This is a heuristic - images typically appear near where they're referenced
                if (imgCounter < imageMap.size) {
                    const imageEntry = Array.from(imagePositions.entries())[imgCounter]
                    if (imageEntry) {
                        const [imageName, imgInfo] = imageEntry
                        const imgSrc = imageMap.get(imageName)

                        if (imgSrc) {
                            const widthAttr = imgInfo.width ? ` data-width="${imgInfo.width}"` : ''
                            const heightAttr = imgInfo.height ? ` data-height="${imgInfo.height}"` : ''
                            newParagraphs.push(`<p class="img-container"><img src="${imgSrc}"${widthAttr}${heightAttr} /></p>`)
                            imgCounter++
                        }
                    }
                }
            }

            htmlContent = newParagraphs.join('')
        }

        if (!htmlContent) {
            return {
                success: false,
                error: 'No content found in Word document'
            }
        }

        // Generate PDF with better formatting
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
            compress: input.compress || false
        })

        const margin = 20
        const pageHeight = 297 // A4 height
        const pageWidth = 210
        const maxWidth = pageWidth - (margin * 2)
        let yPosition = margin

        // Parse HTML
        const container = document.createElement('div')
        container.innerHTML = htmlContent
        document.body.appendChild(container)

        const elements = container.querySelectorAll('p, h1, h2, h3, h4, strong, em, ul, ol, li, img')

        for (const element of Array.from(elements)) {
            // Handle images
            if (element.tagName === 'IMG') {
                const img = element as HTMLImageElement

                try {
                    await new Promise((resolve) => {
                        if (img.complete) resolve(null)
                        else {
                            img.onload = () => resolve(null)
                            img.onerror = () => resolve(null)
                            setTimeout(() => resolve(null), 1000)
                        }
                    })

                    // Use original dimensions from Word if available
                    let imgWidth = parseFloat(img.dataset.width || '0')
                    let imgHeight = parseFloat(img.dataset.height || '0')

                    // If no dimensions from Word, calculate from image
                    if (!imgWidth || !imgHeight) {
                        const aspectRatio = img.naturalHeight / img.naturalWidth
                        imgWidth = Math.min(maxWidth, 160)
                        imgHeight = imgWidth * aspectRatio
                    }

                    // Ensure image fits on page width
                    if (imgWidth > maxWidth) {
                        const scale = maxWidth / imgWidth
                        imgWidth = maxWidth
                        imgHeight = imgHeight * scale
                    }

                    // Check if image fits on current page
                    if (yPosition + imgHeight > pageHeight - margin) {
                        doc.addPage()
                        yPosition = margin
                    }

                    // Center the image
                    const xPosition = (pageWidth - imgWidth) / 2

                    doc.addImage(img.src, 'JPEG', xPosition, yPosition, imgWidth, imgHeight)
                    yPosition += imgHeight + 8
                } catch (err) {
                    console.warn('Failed to add image:', err)
                }
                continue
            }

            const text = element.textContent?.trim() || ''
            if (!text) continue

            let fontSize = 11
            let fontStyle: 'normal' | 'bold' | 'italic' = 'normal'
            let lineSpacing = 6
            let spaceBefore = 2
            let spaceAfter = 2

            // Heading styles
            if (element.tagName === 'H1') {
                fontSize = 20
                fontStyle = 'bold'
                spaceBefore = 12
                spaceAfter = 6
                lineSpacing = 8
            } else if (element.tagName === 'H2') {
                fontSize = 16
                fontStyle = 'bold'
                spaceBefore = 10
                spaceAfter = 5
                lineSpacing = 7
            } else if (element.tagName === 'H3') {
                fontSize = 14
                fontStyle = 'bold'
                spaceBefore = 8
                spaceAfter = 4
                lineSpacing = 6.5
            } else if (element.tagName === 'H4') {
                fontSize = 12
                fontStyle = 'bold'
                spaceBefore = 6
                spaceAfter = 3
                lineSpacing = 6
            } else if (element.tagName === 'STRONG') {
                fontSize = 11
                fontStyle = 'bold'
            } else if (element.tagName === 'EM') {
                fontSize = 11
                fontStyle = 'italic'
            } else if (element.tagName === 'LI') {
                fontSize = 11
                lineSpacing = 5.5
            }

            // Add space before element
            yPosition += spaceBefore

            // Check if heading and ensure it doesn't start too close to bottom
            if (['H1', 'H2', 'H3', 'H4'].includes(element.tagName)) {
                if (yPosition > pageHeight - margin - 30) {
                    doc.addPage()
                    yPosition = margin
                }
            }

            doc.setFontSize(fontSize)
            doc.setFont('helvetica', fontStyle)

            // Handle list items with bullets
            let textToRender = text
            let xOffset = margin

            if (element.tagName === 'LI') {
                const parentList = element.parentElement
                if (parentList?.tagName === 'UL') {
                    doc.text('•', margin, yPosition)
                    xOffset = margin + 5
                } else if (parentList?.tagName === 'OL') {
                    const index = Array.from(parentList.children).indexOf(element) + 1
                    doc.text(`${index}.`, margin, yPosition)
                    xOffset = margin + 7
                }
            }

            const lines = doc.splitTextToSize(textToRender, maxWidth - (xOffset - margin))

            for (let i = 0; i < lines.length; i++) {
                if (yPosition > pageHeight - margin) {
                    doc.addPage()
                    yPosition = margin
                }

                doc.text(lines[i], i === 0 ? xOffset : margin, yPosition)
                yPosition += lineSpacing
            }

            // Add space after element
            yPosition += spaceAfter
        }

        // Clean up
        document.body.removeChild(container)

        const pdfBytes = doc.output('arraybuffer') as ArrayBuffer

        return {
            success: true,
            data: new Uint8Array(pdfBytes),
            metadata: {
                originalSize: input.buffer.length,
                newSize: pdfBytes.byteLength,
                format: 'pdf',
                imagesFound: imageMap.size
            }
        }
    } catch (error) {
        console.error('Word to PDF conversion error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to convert Word to PDF'
        }
    }
}

export async function pdfMerge(input: PdfMergeInput): Promise<ToolResult<Uint8Array>> {
    try {
        if (input.buffers.length < 2) {
            return { success: false, error: 'At least 2 PDFs required for merging' }
        }

        const mergedPdf = await PDFDocument.create()

        for (const buffer of input.buffers) {
            const pdf = await PDFDocument.load(buffer)
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
            copiedPages.forEach((page) => mergedPdf.addPage(page))
        }

        const pdfBytes = await mergedPdf.save()
        return {
            success: true,
            data: pdfBytes,
            metadata: {
                originalSize: input.buffers.reduce((sum, b) => sum + b.length, 0),
                newSize: pdfBytes.length,
                format: 'pdf'
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to merge PDFs'
        }
    }
}

export async function pdfSplit(input: PdfSplitInput): Promise<ToolResult<Uint8Array>> {
    try {
        if (!input.buffer) throw new Error('No buffer!')

        const pdfDoc = await PDFDocument.load(input.buffer)
        const totalPages = pdfDoc.getPageCount()

        let pageIndices: number[]
        if (input.pages && input.pages.length > 0) {
            pageIndices = input.pages.map(p => p - 1).filter(i => i >= 0 && i < totalPages)
            if (pageIndices.length === 0) {
                return { success: false, error: 'No valid page numbers provided' }
            }
        } else {
            pageIndices = [0]
        }

        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices)
        copiedPages.forEach((page) => newPdf.addPage(page))

        const pdfBytes = await newPdf.save()
        return {
            success: true,
            data: pdfBytes,
            metadata: {
                originalSize: input.buffer.length,
                newSize: pdfBytes.length,
                format: 'pdf',
                pageCount: pageIndices.length
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to split PDF'
        }
    }
}

export async function pdfAddTextWatermark(
    input: PdfAddTextWatermarkInput
): Promise<ToolResult<Uint8Array>> {
    try {
        if (!input.buffer) throw new Error('No buffer!')

        const pdfDoc = await PDFDocument.load(input.buffer)
        const pages = pdfDoc.getPages()
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        const fontSize = input.fontSize ?? 50
        const opacity = input.opacity ?? 0.5
        const rotation = input.rotation ?? 45
        const textColor = hexToRgb(input.color ?? "#808080")

        for (const page of pages) {
            const { width, height } = page.getSize()

            const textWidth = font.widthOfTextAtSize(input.text, fontSize)
            const textHeight = fontSize

            // target center position
            let cx = width / 2
            let cy = height / 2

            switch (input.position) {
                case "top-left":
                    cx = 50 + textWidth / 2; cy = height - 80; break
                case "top-right":
                    cx = width - textWidth / 2 - 50; cy = height - 80; break
                case "bottom-left":
                    cx = 50 + textWidth / 2; cy = 50; break
                case "bottom-right":
                    cx = width - textWidth / 2 - 50; cy = 50; break
                default:
                    break
            }

            // convert degrees → radians
            const angle =
                rotation * (Math.PI / 180)

            // shift origin so rotation happens around center
            const dx =
                (textWidth * Math.cos(angle) - textHeight * Math.sin(angle)) / 2
            const dy =
                (textWidth * Math.sin(angle) + textHeight * Math.cos(angle)) / 2

            const x = cx - dx
            const y = cy - dy

            page.drawText(input.text, {
                x,
                y,
                size: fontSize,
                font,
                color: textColor,
                opacity,
                rotate: degrees(
                    rotation
                ),
            })
        }

        const pdfBytes = await pdfDoc.save()

        return {
            success: true,
            data: pdfBytes,
            metadata: {
                originalSize: input.buffer.length,
                newSize: pdfBytes.length,
                format: "pdf",
            },
        }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to add text watermark",
        }
    }
}

export async function pdfAddImageWatermark(input: PdfAddImageWatermarkInput): Promise<ToolResult<Uint8Array>> {
    try {
        if (!input.buffer) throw new Error('No buffer!')
        if (!input.watermarkBuffer) throw new Error('No image buffer!')

        const pdfDoc = await PDFDocument.load(input.buffer)
        const pages = pdfDoc.getPages()

        let embeddedImage
        const imageType = getImageType(input.watermarkBuffer)

        if (imageType === 'png') {
            embeddedImage = await pdfDoc.embedPng(input.watermarkBuffer)
        } else if (imageType === 'jpg') {
            embeddedImage = await pdfDoc.embedJpg(input.watermarkBuffer)
        } else {
            return {
                success: false,
                error: 'Unsupported image type'
            }
        }

        const opacity = input.opacity || 0.5
        const rotation = input.rotation || 0
        const scale = input.scale || 0.3

        const dims = embeddedImage.scale(scale)

        for (const page of pages) {
            const { width, height } = page.getSize()

            // target center position
            let cx = width / 2
            let cy = height / 2

            switch (input.position) {
                case 'top-left':
                    cx = 20; cy = height - dims.height - 20; break
                case 'top-right':
                    cx = width - dims.width - 20; cy = height - dims.height - 20; break
                case 'bottom-left':
                    cx = 20; cy = 20; break
                case 'bottom-right':
                    cx = width - dims.width - 20; cy = 20; break
                default:
                    break
            }

            const angle = rotation * (Math.PI / 180);

            // shift origin so rotation happens around center
            const dx = (dims.width * Math.cos(angle) - dims.height * Math.sin(angle)) / 2;
            const dy = (dims.width * Math.sin(angle) + dims.height * Math.cos(angle)) / 2;

            const x = cx - dx;
            const y = cy - dy;

            page.drawImage(embeddedImage, {
                x,
                y,
                width: dims.width,
                height: dims.height,
                opacity,
                rotate: degrees(rotation)
            })
        }

        const pdfBytes = await pdfDoc.save()
        return {
            success: true,
            data: pdfBytes,
            metadata: {
                originalSize: input.buffer.length,
                newSize: pdfBytes.length,
                format: 'pdf'
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add image watermark'
        }
    }
}

export async function pdfMetadataUpdater(input: PdfMetadataUpdaterInput): Promise<ToolResult<Uint8Array>> {
    try {
        if (!input.buffer) throw new Error('No buffer!')

        const pdfDoc = await PDFDocument.load(input.buffer)

        pdfDoc.setTitle(input.title || '')
        pdfDoc.setAuthor(input.author || '')
        pdfDoc.setSubject(input.subject || '')
        pdfDoc.setKeywords(input.keywords || [])
        pdfDoc.setProducer(input.producer || '')
        pdfDoc.setCreator(input.creator || '')
        pdfDoc.setCreationDate(input.creationDate || new Date(0))
        pdfDoc.setModificationDate(input.modificationDate || new Date(0))

        const pdfBytes = await pdfDoc.save()
        return {
            success: true,
            data: pdfBytes,
            metadata: {
                originalSize: input.buffer.length,
                newSize: pdfBytes.length,
                format: 'pdf'
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to remove metadata'
        }
    }
}

function hexToRgb(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? rgb(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ) : rgb(0.5, 0.5, 0.5)
}

function getImageType(buffer: Uint8Array): 'png' | 'jpg' {
    if (buffer.length > 8) {
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return 'png'
        }
    }
    return 'jpg'
}
