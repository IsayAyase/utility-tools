
import { BsFileEarmarkRichtext, BsFiletypeDocx } from 'react-icons/bs'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { LuAudioLines } from 'react-icons/lu'
import { PiFilePdf, PiResize, PiSubtitles } from 'react-icons/pi'
import { RxTransform } from 'react-icons/rx'
import { TbArrowMerge, TbArrowsSplit2, TbFileInfo, TbVideo } from 'react-icons/tb'
import type { CategoriesWithoutAll, CategoryType, Tool } from './types'

const iconProp = {
    className: "size-7"
}

export const objectOfTools: Record<CategoriesWithoutAll, CategoryType> = {
    document: {
        metadata: {
            title: "PDF Tools Online",
            description: "Free online PDF tools for all your document needs. Convert Word to PDF, merge multiple files, split pages, add watermarks, and edit metadata - all in your browser.",
            keywords: ["pdf tools online", "free pdf converter", "merge pdf", "split pdf", "pdf editor", "document tools", "pdf utilities"],
            category: "document"
        },
        tools: {
            "word_to_pdf": {
                slug: "word_to_pdf",
                name: "Word to PDF Converter",
                description: "Convert Word documents to PDF format instantly. Transform DOCX files into professional, shareable PDFs, without uploading to any server.",
                category: "document",
                tags: ["docx", "word", "convert", "pdf", "document"],
                keywords: [],
                icon: BsFiletypeDocx(iconProp)
            },
            "pdf_merge": {
                slug: "pdf_merge",
                name: "PDF Merge & Combine",
                description: "Combine multiple PDF files into one document effortlessly. Merge PDFs in any order to create a single, organized file for easy sharing and storage.",
                category: "document",
                tags: ["merge", "combine", "join", "pdf", "pdfs", "concatenate", "document"],
                keywords: [],
                icon: TbArrowMerge(iconProp)
            },
            "pdf_split": {
                slug: "pdf_split",
                name: "PDF Splitter & Page Extractor",
                description: "Split large PDF files into separate pages or custom page ranges. Extract specific sections from PDFs to create smaller, manageable documents.",
                category: "document",
                tags: ["split", "extract", "divide", "separate", "break", "slice", "pdf", "document", "page"],
                keywords: [],
                icon: TbArrowsSplit2(iconProp)
            },
            "pdf_add_text_watermark": {
                slug: "pdf_add_text_watermark",
                name: "Add Text Watermark to PDF",
                description: "Add custom text watermarks to PDF documents for branding and copyright protection. Overlay text on any PDF with adjustable opacity, position, and style.",
                category: "document",
                tags: ["document", "pdf", "watermark", "brand", "copyright", "text", "overlay"],
                keywords: [],
                icon: IoDocumentTextOutline(iconProp)
            },
            "pdf_add_image_watermark": {
                slug: "pdf_add_image_watermark",
                name: "Add Image Watermark to PDF",
                description: "Insert logo or image watermarks onto PDF pages. Protect your documents with custom branding and visual copyright markers across all pages.",
                category: "document",
                tags: ["document", "pdf", "watermark", "brand", "copyright", "image", "overlay"],
                keywords: [],
                icon: BsFileEarmarkRichtext(iconProp)
            },
            "pdf_metadata_updater": {
                slug: "pdf_metadata_updater",
                name: "PDF Metadata Editor",
                description: "Edit and update PDF metadata including title, author, subject, and keywords. Organize and optimize your PDF documents with proper information tags.",
                category: "document",
                tags: ["metadata", "info", "properties", "document", "tags", "info", "details", "pdf"],
                keywords: [],
                icon: TbFileInfo(iconProp)
            },
        }
    },
    image: {
        metadata: {
            category: "image",
            title: "Image Tools Online",
            description: "Powerful online image tools to resize, convert formats, create PDFs, and transform your photos. Support for JPG, PNG, WebP and all popular image formats.",
            keywords: ["image converter", "resize images online", "image tools", "photo editor", "format converter", "image to pdf", "online photo tools"],
        },
        tools: {
            "image_resize_convert_format": {
                slug: "image_resize_convert_format",
                name: "Image Resize & Format Converter",
                description: "Resize images and convert between formats (JPG, PNG, WebP). Batch process multiple images while maintaining quality and adjusting dimensions.",
                category: "image",
                tags: ["resize", "scale", "convert", "jpg", "png", "webp", "jpeg", "image", "compress", "format"],
                keywords: [],
                icon: PiResize(iconProp)
            },
            "image_to_pdf": {
                slug: "image_to_pdf",
                name: "Image to PDF Converter",
                description: "Convert single or multiple images into PDF documents. Transform JPG, PNG, and WebP files into professional PDFs with custom page layouts and ordering.",
                category: "image",
                tags: ["pdf", "convert", "jpg", "png", "webp", "jpeg", "image", "compress", "document"],
                keywords: [],
                icon: PiFilePdf(iconProp)
            },
            "image_transform": {
                slug: "image_transform",
                name: "Image Transform & Edit Tool",
                description: "Crop, rotate, flip, and resize images with precision. Professional image transformation tool supporting all popular formats with real-time preview.",
                category: "image",
                tags: ["crop", "rotate", "flip", "image", "transform", "jpg", "png", "webp", "jpeg"],
                keywords: [],
                icon: RxTransform(iconProp)
            },
        }
    },
    audio: {
        metadata: {
            title: "Audio Tools Online",
            description: "Online Audio Tools - Convert, Edit & Transform Audio Files",
            category: "audio",
            keywords: ["audio converter", "audio editor", "audio tools", "audio format converter", "online audio tools"],
        },
        tools: {
            "audio_trim_convert": {
                slug: "audio_trim_convert",
                name: "Audio Trim & Convert",
                description: "Trim, fade, speed adjust, and convert audio files. Supports MP3, WAV, OGG, FLAC, and M4A formats.",
                category: "audio",
                tags: ["audio", "trim", "convert", "start", "end", "time", "wav", "mp3", "ogg"],
                keywords: [],
                icon: LuAudioLines(iconProp)
            },
            "audio_merge": {
                slug: "audio_merge",
                name: "Audio Merge & Combine",
                description: "Merge & Combine multiple audio files into a single track and export to any format. Supports MP3, WAV, OGG, FLAC, and M4A formats.",
                category: "audio",
                tags: ["audio", "merge", "combine", "join", "wav", "mp3", "ogg"],
                keywords: [],
                icon: TbArrowMerge(iconProp)
            }
        }
    },
    video: {
        metadata: {
            title: "Video Tools Online",
            description: "Online Video Tools - Convert, Merge & Edit Video Files",
            category: "video",
            keywords: ["video converter", "video editor", "video tools", "video format converter", "online video tools"],
        },
        tools: {
            "video_trim_convert": {
                slug: "video_trim_convert",
                name: "Video Trim & Convert",
                description: "Trim, fade, speed adjust, and convert video files. Supports MP4, MKV, and WebM formats.",
                category: "video",
                tags: ["video", "trim", "convert", "start", "end", "time", "mp4", "mkv", "webm"],
                keywords: [],
                icon: TbVideo(iconProp)
            },
            "burn_subtitle": {
                slug: "burn_subtitle",
                name: "Burn Subtitle to Video",
                description: "Burn subtitles into video files. Supports MP4, MKV, and WebM formats.",
                category: "video",
                tags: ["video", "subtitle", "burn", "mp4", "mkv", "webm"],
                keywords: [],
                icon: PiSubtitles(iconProp)
            }
        }
    }
}

export function isCategory(category: string, checkAll: boolean = false): category is CategoriesWithoutAll {
    if (checkAll) return category in objectOfTools || category === "all";
    return category in objectOfTools;
}

export const categoryArray = new Array<CategoryType>();
export const toolsArray = new Array<Tool>();
for (const [, tools] of Object.entries(objectOfTools)) {
    categoryArray.push({
        ...tools
    });
    for (const [, value] of Object.entries(tools.tools)) {
        toolsArray.push({ ...value });
    }
}

