'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, AlertCircle, Mail, Sparkles } from 'lucide-react'
import PixelButton from './PixelButton'
import { useAccessibilityContext, useTouchFeedback } from './AccessibilityProvider'

interface ContactFormProps {
  className?: string
}


interface FormField {
  value: string
  error?: string
  touched: boolean
  valid: boolean
}

interface FormState {
  name: FormField
  email: FormField
  subject: FormField
  message: FormField
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>({
    name: { value: '', touched: false, valid: false },
    email: { value: '', touched: false, valid: false },
    subject: { value: '', touched: false, valid: false },
    message: { value: '', touched: false, valid: false }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)
  const { announce } = useAccessibilityContext()
  const { provideTouchFeedback } = useTouchFeedback()

  // Validation functions
  const validateName = (name: string): { valid: boolean; error?: string } => {
    if (name.length < 2) return { valid: false, error: 'Name must be at least 2 characters' }
    if (name.length > 50) return { valid: false, error: 'Name must be less than 50 characters' }
    return { valid: true }
  }

  const validateEmail = (email: string): { valid: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return { valid: false, error: 'Please enter a valid email address' }
    return { valid: true }
  }

  const validateSubject = (subject: string): { valid: boolean; error?: string } => {
    if (subject.length < 3) return { valid: false, error: 'Subject must be at least 3 characters' }
    if (subject.length > 100) return { valid: false, error: 'Subject must be less than 100 characters' }
    return { valid: true }
  }

  const validateMessage = (message: string): { valid: boolean; error?: string } => {
    if (message.length < 10) return { valid: false, error: 'Message must be at least 10 characters' }
    if (message.length > 1000) return { valid: false, error: 'Message must be less than 1000 characters' }
    return { valid: true }
  }

  const updateField = (fieldName: keyof FormState, value: string, touched: boolean = false) => {
    let validation: { valid: boolean; error?: string }
    
    switch (fieldName) {
      case 'name':
        validation = validateName(value)
        break
      case 'email':
        validation = validateEmail(value)
        break
      case 'subject':
        validation = validateSubject(value)
        break
      case 'message':
        validation = validateMessage(value)
        break
      default:
        validation = { valid: false }
    }

    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        value,
        touched,
        valid: validation.valid,
        error: validation.error
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Mark all fields as touched for validation display
    const newFormState = { ...formState }
    Object.keys(newFormState).forEach(key => {
      newFormState[key as keyof FormState].touched = true
    })
    setFormState(newFormState)

    // Check if form is valid
    const isValid = Object.values(formState).every(field => field.valid)
    if (!isValid) return

    setIsSubmitting(true)

    try {
      // Send form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name.value,
          email: formState.email.value,
          subject: formState.subject.value || `Message from ${formState.name.value}`,
          message: formState.message.value
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setShowSuccess(true)
      
      // Announce success to screen readers
      announce('Message sent successfully! Thank you for reaching out.', 'assertive')
      
             // Reset form after success
       setTimeout(() => {
         setFormState({
           name: { value: '', touched: false, valid: false },
           email: { value: '', touched: false, valid: false },
           subject: { value: '', touched: false, valid: false },
           message: { value: '', touched: false, valid: false }
         })
         setShowSuccess(false)
       }, 5000)

    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Show error message to user
      announce('Failed to send message. Please try again or use the email link below.', 'assertive')
      
      // Fall back to mailto link as backup
      const subject = encodeURIComponent(formState.subject.value || `Message from ${formState.name.value}`)
      const body = encodeURIComponent(
        `Name: ${formState.name.value}\nEmail: ${formState.email.value}\nSubject: ${formState.subject.value}\n\nMessage:\n${formState.message.value}`
      )
      const mailtoLink = `mailto:hello@pixelwisdom.dev?subject=${subject}&body=${body}`
      
      // Show fallback option to user
      if (confirm('There was an issue sending your message. Would you like to open your email client instead?')) {
        window.location.href = mailtoLink
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (fieldName: keyof FormState, value: string) => {
    updateField(fieldName, value, true)
  }

  const handleBlur = (fieldName: keyof FormState) => {
    updateField(fieldName, formState[fieldName].value, true)
    setFocusedField(null)
  }

  const handleFocus = (fieldName: keyof FormState) => {
    setFocusedField(fieldName)
  }

  // Enhanced input field component
  const EnhancedInput = ({ 
    fieldName, 
    type = 'text', 
    placeholder, 
    label,
    multiline = false 
  }: { 
    fieldName: keyof FormState
    type?: string
    placeholder: string
    label: string
    multiline?: boolean
  }) => {
    const field = formState[fieldName]
    const isFocused = focusedField === fieldName
    const showError = field.touched && !field.valid && field.error

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <motion.label
          htmlFor={fieldName}
          className="block font-pixel text-sm mb-2 text-gray-300"
          animate={{
            color: isFocused ? '#4ade80' : field.valid ? '#10b981' : showError ? '#ef4444' : '#d1d5db'
          }}
          transition={{ duration: 0.2 }}
        >
          {label} *
          {field.valid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-2 text-green-400"
              aria-label="Field is valid"
            >
              <Check className="w-3 h-3 inline" aria-hidden="true" />
            </motion.span>
          )}
        </motion.label>
        
        <div className="relative">
          {multiline ? (
            <motion.textarea
              id={fieldName}
              value={field.value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onFocus={() => handleFocus(fieldName)}
              onBlur={() => handleBlur(fieldName)}
              placeholder={placeholder}
              rows={5}
              aria-required="true"
              aria-invalid={showError ? 'true' : 'false'}
              aria-describedby={showError ? `${fieldName}-error` : undefined}
              className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-green-400 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 resize-none backdrop-blur-sm touch-manipulation"
              onTouchStart={(e) => {
                provideTouchFeedback(e.currentTarget, `Editing ${label}`)
              }}
              animate={{
                borderColor: isFocused ? '#4ade80' : field.valid ? '#10b981' : showError ? '#ef4444' : '#4b5563',
                boxShadow: isFocused ? '0 0 0 3px rgba(74, 222, 128, 0.1)' : 'none'
              }}
            />
          ) : (
            <motion.input
              type={type}
              id={fieldName}
              value={field.value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onFocus={() => handleFocus(fieldName)}
              onBlur={() => handleBlur(fieldName)}
              placeholder={placeholder}
              aria-required="true"
              aria-invalid={showError ? 'true' : 'false'}
              aria-describedby={showError ? `${fieldName}-error` : undefined}
              className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg text-green-400 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 backdrop-blur-sm touch-manipulation"
              onTouchStart={(e) => {
                provideTouchFeedback(e.currentTarget, `Editing ${label}`)
              }}
              animate={{
                borderColor: isFocused ? '#4ade80' : field.valid ? '#10b981' : showError ? '#ef4444' : '#4b5563',
                boxShadow: isFocused ? '0 0 0 3px rgba(74, 222, 128, 0.1)' : 'none'
              }}
            />
          )}
          
          {/* Field validation icons */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
            {field.valid && !isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Check className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
            {showError && !isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {showError && (
            <motion.p
              id={`${fieldName}-error`}
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-red-400 text-xs font-mono mt-1 flex items-center"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-3 h-3 mr-1" aria-hidden="true" />
              {field.error}
            </motion.p>
          )}
        </AnimatePresence>
        
        {/* Character count for message */}
        {fieldName === 'message' && field.value && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-500 mt-1 text-right font-mono"
          >
            {field.value.length}/1000
          </motion.p>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`bg-gray-800/60 border border-green-400/20 rounded-lg p-6 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="form"
      aria-labelledby="contact-form-title"
    >
      <motion.h2 
        id="contact-form-title"
        className="text-xl font-pixel mb-6 text-green-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Send a Message
      </motion.h2>
      
      <AnimatePresence>
        {showSuccess ? (
          // Success state
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 2, ease: "easeInOut" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-6xl mb-4"
            >
              🚀
            </motion.div>
            <motion.h3
              className="text-xl font-pixel text-green-400 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Message Sent!
            </motion.h3>
            <motion.p
              className="text-gray-300 font-mono text-sm mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank you for reaching out! I&apos;ll get back to you as soon as possible.
            </motion.p>
            
            {/* Pixel celebration effect */}
            <div className="relative">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  initial={{ 
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 0
                  }}
                  animate={{ 
                    opacity: [1, 1, 0],
                    x: Math.cos(i * 30 * Math.PI / 180) * 50,
                    y: Math.sin(i * 30 * Math.PI / 180) * 50,
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          // Form state
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            noValidate
            aria-label="Contact form"
          >
            <EnhancedInput
              fieldName="name"
              type="text"
              placeholder="Your name"
              label="Name"
            />
            
            <EnhancedInput
              fieldName="email"
              type="email"
              placeholder="your.email@example.com"
              label="Email"
            />
            
            <EnhancedInput
              fieldName="subject"
              type="text"
              placeholder="What&apos;s this about?"
              label="Subject"
            />
            
            <EnhancedInput
              fieldName="message"
              placeholder="Tell me about your project, idea, or just say hello!"
              label="Message"
              multiline
            />
            
            <PixelButton
              type="submit"
              disabled={isSubmitting || !Object.values(formState).every(field => field.valid)}
              loading={isSubmitting}
              variant="primary"
              size="lg"
              fullWidth={true}
              icon={isSubmitting ? undefined : Mail}
              iconPosition="left"
              pixelEffect={true}
              glowEffect={true}
              pressEffect={true}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </PixelButton>
          </motion.form>
        )}
      </AnimatePresence>
      
      {!showSuccess && (
        <motion.p
          className="font-mono text-xs text-gray-400 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          * Your message will be sent directly. If there&apos;s an issue, we&apos;ll fall back to email.
        </motion.p>
      )}
    </motion.div>
  )
}
