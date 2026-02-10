import type { ReactNode } from 'react'

export type CategoriesWithAll = "all" | "document" | "image" | "audio" | "video" | "developer"
export type CategoriesWithoutAll = Exclude<CategoriesWithAll, "all">

export type Tool = {
    slug: string
    name: string
    description: string
    category: CategoriesWithoutAll
    keywords: string[]
    tags: string[]
    icon: ReactNode
    lightBgColor: string
    darkBgColor: string
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

export type ToolResult<T = Uint8Array> = {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    originalSize?: number
    newSize?: number
    format?: string
    width?: number
    height?: number
    duration?: number
    pageCount?: number
    [key: string]: unknown
  }
}