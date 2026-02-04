
import { BsFileEarmarkRichtext, BsFiletypeDocx } from 'react-icons/bs'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { LuAudioLines } from 'react-icons/lu'
import { PiFilePdf, PiResize } from 'react-icons/pi'
import { RxTransform } from 'react-icons/rx'
import { TbArrowMerge, TbArrowsSplit2, TbFileInfo, TbVideo } from 'react-icons/tb'
import type { CategoriesWithoutAll, CategoryType, Tool } from './types'

const iconProp = {
    className: "size-7"
}

export const objectOfTools: Record<CategoriesWithoutAll, CategoryType> = {
    document: {
        metadata: {
            title: "BladeTools | Secure PDF & Document Tools - 100% Private",
            description: "Edit, convert, and manage your documents with BladeTools. Professional-grade PDF tools that run entirely in your browser—no file uploads, maximum privacy.",
            keywords: ["BladeTools", "secure PDF tools", "private document processing", "browser-based PDF editor", "no upload PDF converter", "privacy first document tools"],
            category: "document"
        },
        tools: {
            "word_to_pdf": {
                slug: "word_to_pdf",
                name: "Word to PDF Converter",
                description: "Seamlessly convert DOCX and Word documents to PDF with BladeTools. High-quality conversion with built-in compression for optimized file sizes.",
                category: "document",
                tags: ["docx", "word", "convert", "pdf", "document"],
                keywords: ["BladeTools word to pdf", "convert docx to pdf locally", "secure word converter", "private pdf maker"],
                icon: BsFiletypeDocx(iconProp)
            },
            "pdf_merge": {
                slug: "pdf_merge",
                name: "PDF Merge & Combine",
                description: "Combine multiple PDF files into one. Arrange, reorder, and merge your documents instantly without them ever leaving your device.",
                category: "document",
                tags: ["merge", "combine", "join", "pdf", "pdfs", "concatenate", "document"],
                keywords: ["merge pdf online", "combine pdf files", "BladeTools pdf joiner", "secure pdf merger"],
                icon: TbArrowMerge(iconProp)
            },
            "pdf_split": {
                slug: "pdf_split",
                name: "PDF Splitter & Page Extractor",
                description: "Break large PDFs into smaller files or extract specific pages. BladeTools gives you precise control over your document structure locally.",
                category: "document",
                tags: ["split", "extract", "divide", "separate", "break", "slice", "pdf", "document", "page"],
                keywords: ["split pdf online", "extract pages from pdf", "pdf page cutter", "BladeTools splitter"],
                icon: TbArrowsSplit2(iconProp)
            },
            "pdf_add_text_watermark": {
                slug: "pdf_add_text_watermark",
                name: "Add Text Watermark to PDF",
                description: "Secure your documents by overlaying custom text watermarks. Ideal for copyrighting, branding, or marking files as 'Confidential'.",
                category: "document",
                tags: ["document", "pdf", "watermark", "brand", "copyright", "text", "overlay"],
                keywords: ["add watermark to pdf", "pdf text overlay", "document branding", "BladeTools security"],
                icon: IoDocumentTextOutline(iconProp)
            },
            "pdf_add_image_watermark": {
                slug: "pdf_add_image_watermark",
                name: "Add Image Watermark to PDF",
                description: "Apply company logos or transparent stamps to all pages of your PDF. Professional branding processed safely in your browser.",
                category: "document",
                tags: ["document", "pdf", "watermark", "brand", "copyright", "image", "overlay"],
                keywords: ["image watermark pdf", "logo to pdf", "stamp pdf online", "BladeTools image overlay"],
                icon: BsFileEarmarkRichtext(iconProp)
            },
            "pdf_metadata_updater": {
                slug: "pdf_metadata_updater",
                name: "PDF Metadata Editor",
                description: "Clean or update document properties. Edit titles, authors, and keywords to improve your document's professional presentation and SEO.",
                category: "document",
                tags: ["metadata", "info", "properties", "document", "tags", "info", "details", "pdf"],
                keywords: ["edit pdf metadata", "change pdf author", "pdf tag editor", "BladeTools metadata tool"],
                icon: TbFileInfo(iconProp)
            },
        }
    },
    image: {
        metadata: {
            category: "image",
            title: "BladeTools | Fast Image Editor & Converter - No Uploads",
            description: "Resize, convert, and edit images instantly with BladeTools. Your photos stay on your computer while you transform them for web or print.",
            keywords: ["BladeTools image tools", "private image editor", "browser image resizer", "convert photos online", "secure photo tools"],
        },
        tools: {
            "image_resize_convert_format": {
                slug: "image_resize_convert_format",
                name: "Image Resize & Format Converter",
                description: "Batch resize images and switch between JPG, PNG, WebP, and ICO formats without losing quality. Fast, local, and secure.",
                category: "image",
                tags: ["resize", "scale", "convert", "jpg", "png", "webp", "jpeg", "image", "compress", "format"],
                keywords: ["resize image online", "convert jpg to webp", "BladeTools image resizer", "png to jpg converter"],
                icon: PiResize(iconProp)
            },
            "image_to_pdf": {
                slug: "image_to_pdf",
                name: "Image to PDF Converter",
                description: "Convert your gallery into a professional PDF document. Perfect for portfolios, receipts, and multi-page document creation.",
                category: "image",
                tags: ["pdf", "convert", "jpg", "png", "webp", "jpeg", "image", "compress", "document"],
                keywords: ["jpg to pdf converter", "png to pdf", "convert images to pdf", "BladeTools photo to pdf"],
                icon: PiFilePdf(iconProp)
            },
            "image_transform": {
                slug: "image_transform",
                name: "Image Transform & Edit Tool",
                description: "Crop to specific ratios, rotate, or flip your images with BladeTools' high-precision browser-based editing suite.",
                category: "image",
                tags: ["crop", "rotate", "flip", "image", "transform", "jpg", "png", "webp", "jpeg"],
                keywords: ["crop image online", "rotate photo", "image flip tool", "BladeTools transformation"],
                icon: RxTransform(iconProp)
            },
        }
    },
    audio: {
        metadata: {
            title: "BladeTools | Private Audio Cutter & Converter",
            description: "Process your audio files without uploading. Trim, merge, and convert MP3, WAV, and FLAC files directly on your device with BladeTools.",
            category: "audio",
            keywords: ["BladeTools audio", "private mp3 cutter", "online audio joiner", "browser audio converter", "secure audio tools"],
        },
        tools: {
            "audio_trim_convert": {
                slug: "audio_trim_convert",
                name: "Audio Trim & Convert",
                description: "Create ringtones or clips. Trim audio files with millisecond precision and convert to any format including MP3, WAV, and OGG.",
                category: "audio",
                tags: ["audio", "trim", "convert", "start", "end", "time", "wav", "mp3", "ogg"],
                keywords: ["trim mp3 online", "audio cutter", "convert wav to mp3", "BladeTools audio trimmer"],
                icon: LuAudioLines(iconProp)
            },
            "audio_merge": {
                slug: "audio_merge",
                name: "Audio Merge & Combine",
                description: "Stitch multiple audio tracks together. Seamlessly combine files into a single high-quality export for podcasts or music.",
                category: "audio",
                tags: ["audio", "merge", "combine", "join", "wav", "mp3", "ogg"],
                keywords: ["merge audio files", "combine mp3s", "audio joiner online", "BladeTools audio merger"],
                icon: TbArrowMerge(iconProp)
            }
        }
    },
    video: {
        metadata: {
            title: "BladeTools | Browser-Based Video Tools",
            description: "Edit video files privately. Trim clips and burn subtitles into videos using BladeTools' secure local processing technology.",
            category: "video",
            keywords: ["BladeTools video", "trim video online", "hardcode subtitles", "video converter no upload", "secure video editor"],
        },
        tools: {
            "video_trim_convert": {
                slug: "video_trim_convert",
                name: "Video Trim & Convert",
                description: "Quickly cut unwanted parts from your videos. Convert between MP4, MKV, and WebM formats with optimized speed.",
                category: "video",
                tags: ["video", "trim", "convert", "start", "end", "time", "mp4", "mkv", "webm"],
                keywords: ["trim mp4 online", "video cutter", "convert video to webm", "BladeTools video trim"],
                icon: TbVideo(iconProp)
            },
            // "add_subtitle_in_video": {
            //     slug: "add_subtitle_in_video",
            //     name: "Add Subtitle In Video",
            //     description: "Hardcode subtitles directly into your video files so they play on any device. Fast, local, and permanent subtitle embedding.",
            //     category: "video",
            //     tags: ["video", "subtitle", "burn", "mp4", "mkv", "webm"],
            //     keywords: ["burn srt to video", "hardcode subtitles online", "add subtitles to mp4", "BladeTools subtitle tool"],
            //     icon: PiSubtitles(iconProp)
            // }
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

