'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ContactFormProps {
  className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSubmitted(true)
      // Reset form
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-xl font-pixel mb-4 text-green-400">Message Sent! ✓</h2>
          <p className="font-mono text-gray-300 mb-4">
            Thank you for reaching out! I&apos;ll get back to you as soon as possible.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="font-pixel bg-green-600 hover:bg-green-500 text-black"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-pixel mb-6">Send a Message</h2>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-3 mb-4">
          <p className="font-mono text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-mono text-sm mb-2">
            Name *
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            className="bg-gray-700 border-gray-600 text-green-400 font-mono focus:border-green-400"
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block font-mono text-sm mb-2">
            Email *
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            className="bg-gray-700 border-gray-600 text-green-400 font-mono focus:border-green-400"
            placeholder="your.email@example.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block font-mono text-sm mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            className="bg-gray-700 border-gray-600 text-green-400 font-mono focus:border-green-400"
            placeholder="Tell me about your project, idea, or just say hello!"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-pixel bg-green-600 hover:bg-green-500 text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message →'}
        </Button>
      </form>
      
      <p className="font-mono text-xs text-gray-400 mt-4">
        * All fields are required. Your message will be delivered directly to my inbox.
      </p>
    </div>
  )
}
