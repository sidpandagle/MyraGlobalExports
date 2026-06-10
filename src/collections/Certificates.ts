import type { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'certificateNumber', type: 'text' },
    { name: 'issueDate', type: 'date' },
    { name: 'expiryDate', type: 'date' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'pdf', type: 'upload', relationTo: 'media' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
