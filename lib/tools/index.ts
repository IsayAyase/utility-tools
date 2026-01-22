export type CategoriesWithAll = "all" | "document" | "image"
export type CategoriesWithoutAll = "document" | "image"
//  | "audio" | "developer" | "video"  

export type Tool = {
    slug: string
    name: string
    description: string
    category: CategoriesWithoutAll
    keywords: string[]
}

export type CategoryType = {
    tools: Record<string, Tool>
    metadata: {
        title: string
        description: string
        keywords: string[]
        category: CategoriesWithoutAll
    }
}


export const objectOfTools: Record<CategoriesWithoutAll, CategoryType> = {
    document: {
        tools: {
            "word_to_pdf": {
                slug: "word_to_pdf",
                name: "Word to PDF",
                description: "Convert Word document (DOCX) to PDF format",
                category: "document",
                keywords: ["docx", "pdf", "convert", "word"]
            },
            "pdf_merge": {
                slug: "pdf_merge",
                name: "PDF Merge",
                description: "Merge multiple PDF documents into a single PDF",
                category: "document",
                keywords: ["pdf", "merge", "combine", "join"]
            },
            "pdf_split": {
                slug: "pdf_split",
                name: "PDF Split",
                description: "Split PDF document into individual pages or ranges",
                category: "document",
                keywords: ["pdf", "split", "extract", "pages"]
            },
            "pdf_add_text_watermark": {
                slug: "pdf_add_text_watermark",
                name: "PDF Add Text Watermark",
                description: "Add text watermark to PDF document",
                category: "document",
                keywords: ["pdf", "watermark", "text", "add"]
            },
            "pdf_add_image_watermark": {
                slug: "pdf_add_image_watermark",
                name: "PDF Add Image Watermark",
                description: "Add image watermark to PDF document",
                category: "document",
                keywords: ["pdf", "watermark", "image", "add"]
            },
            "pdf_metadata_updater": {
                slug: "pdf_metadata_updater",
                name: "PDF Metadata Updater",
                description: "Updates metadata of a PDF document",
                category: "document",
                keywords: ["pdf", "metadata", "update", "info"]
            },
        },
        metadata: {
            title: "PDF Tools",
            description: "Tools for working with PDF documents",
            keywords: ["pdf", "tools", "convert", "merge", "split", "watermark", "metadata", "update"],
            category: "document"
        }
    },
    image: {
        metadata: {
            category: "image",
            title: "Image Tools",
            description: "Tools for working with image files",
            keywords: ["image", "tools", "convert", "merge", "split", "watermark", "metadata", "update"],
        },
        tools: {
            "image_format_convert": {
                slug: "image_format_convert",
                name: "Image Format Convert",
                description: "Convert image between different formats using Canvas API",
                category: "image",
                keywords: ["image", "tools", "convert", "merge", "split", "watermark", "metadata", "update"],
            },
        }
    }
}

export function isCategory(category: string, checkAll: boolean = false): category is CategoriesWithoutAll {
    if (checkAll) return category in objectOfTools || category === "all";
    return category in objectOfTools;
}

export const categoryArray = new Array<CategoryType>();
export const toolsArray = new Array<Tool>();
for (const [_, tools] of Object.entries(objectOfTools)) {
    categoryArray.push({
        ...tools
    });
    for (const [_, value] of Object.entries(tools.tools)) {
        toolsArray.push({ ...value });
    }
}

const tools = {
    image: import('./image'),
    audio: import('./audio'),
    document: import('./document'),
    developer: import('./developer'),
    helper: import('./helper')
}

export default tools

