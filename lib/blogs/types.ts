export interface BlogPostMetaData {
    title: string
    description?: string
    date: Date
    tags?: string[]
    author?: string[]
    readTime?: string
    category?: string
    imageUrl?: string
    published?: boolean
}

export interface BlogPost {
    slug: string
    content: string   // raw MDX
    metadata: BlogPostMetaData
}

export interface ListOfBlogPostsItem {
    slug: string
    metadata: BlogPostMetaData
    created: number
}