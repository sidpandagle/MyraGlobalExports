import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import Papa from 'papaparse'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'inquiries',
      limit: 10000,
      sort: '-createdAt',
    })

    const rows = docs.map((inq) => ({
      Date: inq.createdAt
        ? new Date(inq.createdAt as string).toLocaleDateString('en-IN')
        : '',
      'Full Name': (inq.fullName as string) ?? '',
      Company: (inq.company as string) ?? '',
      Country: (inq.country as string) ?? '',
      'Product Required': (inq.productRequired as string) ?? '',
      Quantity: (inq.quantity as string) ?? '',
      Email: (inq.email as string) ?? '',
      WhatsApp: (inq.whatsapp as string) ?? '',
      Message: (inq.message as string) ?? '',
      Status: (inq.status as string) ?? 'new',
    }))

    const csv = Papa.unparse(rows)
    const filename = `inquiries-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('Export failed:', err)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
