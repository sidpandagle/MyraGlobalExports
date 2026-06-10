import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { sendInquiryNotificationEmail } from '@/lib/email'

const schema = z.object({
  fullName: z.string().min(2),
  company: z.string().optional(),
  country: z.string().min(2),
  productRequired: z.string().min(2),
  quantity: z.string().optional(),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const payload = await getPayloadClient()
  await payload.create({ collection: 'inquiries', data: { ...parsed.data, status: 'new' } })

  try {
    await sendInquiryNotificationEmail(parsed.data)
  } catch (err) {
    console.error('Email notification failed:', err)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
