import blogData from './blog-articles.json'

export interface BlogArticle {
  id: string
  title: string
  description: string
  tags: string[]
  readTime: string
  content: string
}

export const blogArticles: BlogArticle[] = blogData
