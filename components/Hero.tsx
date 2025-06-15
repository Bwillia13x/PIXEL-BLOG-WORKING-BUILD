import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  className?: string
}

export default function Hero({ 
  title, 
  subtitle, 
  ctaText, 
  ctaHref, 
  className = '' 
}: HeroProps) {
  return (
    <section className={`text-center py-12 ${className}`}>
      <h1 className="text-4xl md:text-5xl font-pixel mb-6 leading-tight">
        {title}
      </h1>
      
      {subtitle && (
        <p className="font-mono text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300">
          {subtitle}
        </p>
      )}
      
      {ctaText && ctaHref && (
        <div>
          <Link 
            href={ctaHref}
            className="inline-block px-8 py-3 bg-green-600 text-black font-pixel text-lg rounded hover:bg-green-500 transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </section>
  )
}
