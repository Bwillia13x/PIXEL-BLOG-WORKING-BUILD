import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  id: string
  slug: string
  title: string
  category: string
  date?: string
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

function getPostData(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '')
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    id: slug,
    slug,
    title: (data.title as string) ?? slug,
    category: (data.category as string) ?? 'Blog',
    date: data.date as string | undefined,
    content,
  }
}

export const posts: Post[] = fs
  .readdirSync(postsDirectory)
  .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  .map(getPostData)
  .sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })
