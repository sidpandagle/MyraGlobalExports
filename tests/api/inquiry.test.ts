import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'test-id' }),
  }),
}))

vi.mock('@/lib/email', () => ({
  sendInquiryNotificationEmail: vi.fn().mockResolvedValue(undefined),
}))

const validBody = {
  fullName: 'John Smith',
  country: 'UAE',
  productRequired: 'Basmati Rice',
  email: 'john@example.com',
}

describe('POST /api/inquiry', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 201 for valid payload', async () => {
    const { POST } = await import('@/app/api/inquiry/route')
    const req = new NextRequest('http://localhost/api/inquiry', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('returns 400 when required fields are missing', async () => {
    const { POST } = await import('@/app/api/inquiry/route')
    const req = new NextRequest('http://localhost/api/inquiry', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'John' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email', async () => {
    const { POST } = await import('@/app/api/inquiry/route')
    const req = new NextRequest('http://localhost/api/inquiry', {
      method: 'POST',
      body: JSON.stringify({ ...validBody, email: 'not-an-email' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
