'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  company: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  productRequired: z.string().min(2, 'Product is required'),
  quantity: z.string().optional(),
  email: z.string().email('Valid email required'),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
  'Brazil','Canada','China','Egypt','France','Germany','Ghana','India','Indonesia','Iran',
  'Iraq','Italy','Japan','Jordan','Kenya','Kuwait','Malaysia','Mexico','Morocco','Myanmar',
  'Netherlands','Nigeria','Oman','Pakistan','Philippines','Poland','Qatar','Russia',
  'Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Tanzania','Thailand','Turkey','UAE','Uganda','UK','Ukraine',
  'USA','Vietnam','Yemen','Zambia','Zimbabwe',
]

export function InquiryForm() {
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
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      reset()
    } catch {
      setError(
        'Something went wrong. Please email us directly at info@myraglobalexports.com',
      )
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <div className="mb-3 text-5xl" aria-hidden="true">✅</div>
        <h3 className="text-xl font-bold text-brand-green">Inquiry Received!</h3>
        <p className="mt-2 text-gray-600">
          We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-brand-green underline"
        >
          Submit another inquiry
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName')}
            className={inputClass}
            placeholder="John Smith"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
          <input
            {...register('company')}
            className={inputClass}
            placeholder="Your Company"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <select {...register('country')} className={inputClass}>
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Product Required <span className="text-red-500">*</span>
          </label>
          <input
            {...register('productRequired')}
            className={inputClass}
            placeholder="e.g. Basmati Rice"
          />
          {errors.productRequired && (
            <p className="mt-1 text-xs text-red-500">{errors.productRequired.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantity Required
          </label>
          <input
            {...register('quantity')}
            className={inputClass}
            placeholder="e.g. 10 MT"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className={inputClass}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          WhatsApp Number
        </label>
        <input
          {...register('whatsapp')}
          className={inputClass}
          placeholder="+1 234 567 8900 (with country code)"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
        <textarea
          {...register('message')}
          rows={4}
          className={inputClass}
          placeholder="Any specific requirements, packaging preferences, or questions..."
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-green py-3 font-semibold text-white transition-colors hover:bg-brand-green-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
