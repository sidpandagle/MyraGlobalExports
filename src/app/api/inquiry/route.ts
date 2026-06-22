import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

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

  const { fullName, company, country, productRequired, quantity, email, whatsapp, message } = parsed.data

  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').insert({
    full_name: fullName,
    company: company ?? null,
    country,
    product_required: productRequired,
    quantity: quantity ?? null,
    email,
    whatsapp: whatsapp ?? null,
    message: message ?? null,
    source: req.headers.get('referer') ?? null,
    status: 'new',
  })

  if (error) {
    console.error('Lead insert error:', error)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
