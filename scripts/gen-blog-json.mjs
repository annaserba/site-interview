import { writeFileSync } from 'fs'
import { blogArticles } from '../src/blog-articles.ts'

writeFileSync('src/blog-articles.json', JSON.stringify(blogArticles, null, 2))
console.log('✓ Generated src/blog-articles.json')
