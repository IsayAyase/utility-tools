import fs from "fs"
import matter from "gray-matter"
import path from "path"
import type { BlogPost, ListOfBlogPostsItem } from "./types"

const BLOG_CONTENT = path.join(process.cwd(), "./lib/blogs/contents")

export function getBlogBySlug(slug: string): BlogPost | null {
    // Try to find the file with case-insensitive matching
    const files = fs.readdirSync(BLOG_CONTENT)
    const targetFileName = `${slug}.mdx`
    const matchingFile = files.find(file =>
        file === targetFileName
    )
    if (!matchingFile) {
        return null
    }

    const filePath = path.join(BLOG_CONTENT, matchingFile)
    const file = fs.readFileSync(filePath, "utf8")
    const { content, data } = matter(file)
    if (data.published === false) {
        return null
    }

    return {
        slug,
        content,
        metadata: data,
    } as BlogPost
}

/**
 * @param limit -> -1 for all blogs (default)
 * @returns 
 */
export function getAllBlogs(limit: number = -1): ListOfBlogPostsItem[] {
    const files = fs.readdirSync(BLOG_CONTENT)
        .filter(file => file.endsWith(".mdx"))

    const posts = files.map(file => {
        const filePath = path.join(BLOG_CONTENT, file)
        const fileContent = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContent)
        const slug = file.replace(/\.mdx$/, "")
        const created = fs.statSync(filePath).birthtimeMs

        return {
            slug,
            metadata: data,
            created: data.date || created
        } as ListOfBlogPostsItem
    })
        .filter(post => post.metadata.published !== false)
        .sort((a, b) => b.created - a.created)

    // Apply limit after filtering and sorting
    return limit !== -1 ? posts.slice(0, limit) : posts
}

/**
 * Get up to 4 blog posts that have any of the specified tags
 * @param targetTags - Array of tags to filter by
 * @param slugToSkip - Slug of the current blog post (default: null)
 * @param maxPosts - Maximum number of posts to return (default: 4)
 * @returns List of blog posts matching any of the given tags, sorted by date
 */
export function getBlogsByTags(targetTags: string[], slugToSkip: string | null = null, maxPosts: number = 4): ListOfBlogPostsItem[] {
    const allPosts = getAllBlogs();
    type ListOfBlogPostsItemWithScore = ListOfBlogPostsItem & { score: number };

    const setOfTargetTags = new Set<string>();
    const postWithScore = new Array<ListOfBlogPostsItemWithScore>();

    for (const tag of targetTags) setOfTargetTags.add(tag);

    for (const post of allPosts) {
        if (post.slug === slugToSkip) continue;
        if (!post.metadata.tags || post.metadata.tags.length === 0) continue;

        let score = 0;
        for (const tag of post.metadata.tags) {
            if (!setOfTargetTags.has(tag)) continue;
            score += 1;
        }

        if (score === 0) continue;
        postWithScore.push({ ...post, score });
    }

    postWithScore.sort((a, b) => b.score - a.score);

    const matchings = new Array<ListOfBlogPostsItem>();

    for (const post of postWithScore) {
        matchings.push(post);
        if (matchings.length === maxPosts) break;
    }
    return matchings;
}