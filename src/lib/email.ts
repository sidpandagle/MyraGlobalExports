import { Resend } from 'resend'

export type InquiryData = {
  fullName: string
  company?: string
  country: string
  productRequired: string
  quantity?: string
  email: string
  whatsapp?: string
  message?: string
}

export function buildInquiryEmailSubject(
  data: Pick<InquiryData, 'productRequired' | 'country' | 'fullName'>,
): string {
  return `New Inquiry: ${data.productRequired} from ${data.country} — ${data.fullName}`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function buildInquiryEmailHtml(data: InquiryData): string {
  const rows: [string, string][] = [
    ['Full Name', escapeHtml(data.fullName)],
    ['Company', escapeHtml(data.company ?? '—')],
    ['Country', escapeHtml(data.country)],
    ['Product Required', escapeHtml(data.productRequired)],
    ['Quantity', escapeHtml(data.quantity ?? '—')],
    ['Email', escapeHtml(data.email)],
    ['WhatsApp', escapeHtml(data.whatsapp ?? '—')],
    ['Message', escapeHtml(data.message ?? '—')],
  ]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:bold;background:#fff;border:1px solid #e0e0e0;width:40%">${label}</td>
        <td style="padding:8px 12px;background:#fff;border:1px solid #e0e0e0">${value}</td>
      </tr>`,
    )
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#1B5E20;color:white;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">🌾 New Export Inquiry — Myra Global Exports</h2>
      </div>
      <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">${tableRows}</table>
        <p style="margin-top:16px;color:#666;font-size:12px">
          This inquiry was submitted via the Myra Global Exports website. Please respond within 24 hours.
        </p>
      </div>
    </div>
  `
}

export async function sendInquiryNotificationEmail(data: InquiryData): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Myra Global Website <noreply@myraglobalexports.com>',
    to: [process.env.INQUIRY_NOTIFICATION_EMAIL ?? 'info@myraglobalexports.com'],
    replyTo: data.email,
    subject: buildInquiryEmailSubject(data),
    html: buildInquiryEmailHtml(data),
  })
}
