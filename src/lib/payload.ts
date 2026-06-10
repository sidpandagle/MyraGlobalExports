import { getPayload } from 'payload'
import config from '@/payload.config'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

const globalForPayload = globalThis as typeof globalThis & {
  _payloadClient?: PayloadClient
}

export async function getPayloadClient(): Promise<PayloadClient> {
  if (globalForPayload._payloadClient) return globalForPayload._payloadClient
  globalForPayload._payloadClient = await getPayload({ config })
  return globalForPayload._payloadClient
}
