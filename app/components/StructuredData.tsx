import { generateStructuredData, StructuredDataProps } from '@/lib/seo'

interface StructuredDataComponentProps {
  data: StructuredDataProps[]
}

export function StructuredData({ data }: StructuredDataComponentProps) {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData(item)
          }}
        />
      ))}
    </>
  )
}

// Convenience components for common structured data types

interface BlogPostStructuredDataProps {
  title: string
  description: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  image?: string
  tags?: string[]
  readingTime?: number
}

export function BlogPostStructuredData({
  title,
  description,
  url,
  publishedTime,
  modifiedTime,
  author,
  image,
  tags,
  readingTime
}: BlogPostStructuredDataProps) {
  const structuredData: StructuredDataProps = {
    type: 'BlogPosting',
    data: {
      headline: title,
      description,
      url,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: author,
      ...(image && {
        image: {
          '@type': 'ImageObject',
          url: image
        }
      }),
      ...(tags && { keywords: tags.join(', ') }),
      ...(readingTime && {
        timeRequired: `PT${readingTime}M`
      })
    }
  }

  return <StructuredData data={[structuredData]} />
}

interface ProjectStructuredDataProps {
  title: string
  description: string
  url: string
  image?: string
  technologies?: string[]
  demo?: string
  github?: string
  year?: number
}

export function ProjectStructuredData({
  title,
  description,
  url,
  image,
  technologies,
  demo,
  github,
  year
}: ProjectStructuredDataProps) {
  const structuredData: StructuredDataProps = {
    type: 'Project',
    data: {
      name: title,
      description,
      url,
      ...(image && {
        image: {
          '@type': 'ImageObject',
          url: image
        }
      }),
      ...(technologies && { keywords: technologies.join(', ') }),
      ...(demo && {
        workExample: {
          '@type': 'WebSite',
          url: demo
        }
      }),
      ...(github && { codeRepository: github }),
      ...(year && { dateCreated: `${year}-01-01` })
    }
  }

  return <StructuredData data={[structuredData]} />
}

interface PersonStructuredDataProps {
  name: string
  jobTitle?: string
  description?: string
  url?: string
  image?: string
  sameAs?: string[]
  email?: string
  skills?: string[]
}

export function PersonStructuredData({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs,
  email,
  skills
}: PersonStructuredDataProps) {
  const structuredData: StructuredDataProps = {
    type: 'Person',
    data: {
      name,
      ...(jobTitle && { jobTitle }),
      ...(description && { description }),
      ...(url && { url }),
      ...(image && {
        image: {
          '@type': 'ImageObject',
          url: image
        }
      }),
      ...(sameAs && { sameAs }),
      ...(email && { email }),
      ...(skills && { hasOccupation: skills.map(skill => ({ '@type': 'Occupation', name: skill })) })
    }
  }

  return <StructuredData data={[structuredData]} />
}

interface WebSiteStructuredDataProps {
  name: string
  description: string
  url: string
  searchUrl?: string
}

export function WebSiteStructuredData({
  name,
  description,
  url,
  searchUrl
}: WebSiteStructuredDataProps) {
  const structuredData: StructuredDataProps = {
    type: 'WebSite',
    data: {
      name,
      description,
      url,
      ...(searchUrl && {
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: searchUrl
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  }

  return <StructuredData data={[structuredData]} />
}

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface FAQStructuredDataProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface VideoStructuredDataProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  embedUrl?: string
  url: string
}

export function VideoStructuredData({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
  url
}: VideoStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    url,
    ...(duration && { duration }),
    ...(embedUrl && { embedUrl })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

export default StructuredData