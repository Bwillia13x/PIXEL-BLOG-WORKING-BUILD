'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ContactFormProps {
  className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`Message from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    const mailtoLink = `mailto:hello@pixelwisdom.dev?subject=${subject}&body=${body}`
    
    // Open default email client
    window.location.href = mailtoLink
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-pixel mb-6">Send a Message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-readable text-sm mb-2">
            Name *
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600 text-green-400 font-readable focus:border-green-400"
            placeholder="Your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block font-readable text-sm mb-2">
            Email *
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600 text-green-400 font-readable focus:border-green-400"
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block font-readable text-sm mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600 text-green-400 font-readable focus:border-green-400"
            placeholder="Tell me about your project, idea, or just say hello!"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full font-pixel bg-green-600 hover:bg-green-500 text-black"
        >
          Send via Email →
        </Button>
      </form>
      
      <p className="font-readable text-xs text-gray-400 mt-4">
        * This will open your default email client with the message pre-filled.
      </p>
    </div>
  )
}
