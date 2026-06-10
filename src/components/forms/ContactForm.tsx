'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.name,
          country: 'N/A (General Contact)', // sentinel value — must stay ≥2 chars for API validation
          productRequired: data.subject,
          email: data.email,
          message: data.message,
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      reset()
    } catch {
      setError(
        'Something went wrong. Please email info@myraglobalexports.com directly.',
      )
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <p className="text-3xl" aria-hidden="true">✅</p>
        <p className="mt-2 font-semibold text-brand-green">
          Message sent! We&apos;ll be in touch soon.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input {...register('name')} className={inputClass} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input {...register('email')} type="email" className={inputClass} />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <input {...register('subject')} className={inputClass} />
        {errors.subject && (
          <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea {...register('message')} rows={5} className={inputClass} />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-green py-3 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
