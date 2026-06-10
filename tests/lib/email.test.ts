import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => {
  const mockSend = vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null })
  function Resend() {
    return { emails: { send: mockSend } }
  }
  return { Resend }
})

import { buildInquiryEmailSubject, buildInquiryEmailHtml } from '@/lib/email'

describe('buildInquiryEmailSubject', () => {
  it('includes product and country in subject', () => {
    const subject = buildInquiryEmailSubject({
      productRequired: 'Basmati Rice',
      country: 'UAE',
      fullName: 'John Smith',
    })
    expect(subject).toContain('Basmati Rice')
    expect(subject).toContain('UAE')
  })
})

describe('buildInquiryEmailHtml', () => {
  it('contains all inquiry fields in the HTML', () => {
    const html = buildInquiryEmailHtml({
      fullName: 'John Smith',
      company: 'ABC Traders',
      country: 'UAE',
      productRequired: 'Basmati Rice',
      quantity: '10 MT',
      email: 'john@abc.com',
      whatsapp: '+971501234567',
      message: 'Please send quote.',
    })
    expect(html).toContain('John Smith')
    expect(html).toContain('Basmati Rice')
    expect(html).toContain('10 MT')
    expect(html).toContain('john@abc.com')
    expect(html).toContain('Please send quote.')
  })
})
