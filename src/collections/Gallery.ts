import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Business Activities', value: 'business' },
        { label: 'Export Shipments', value: 'shipment' },
        { label: 'Team & Meetings', value: 'team' },
        { label: 'Suppliers & Partners', value: 'partners' },
        { label: 'Certificates', value: 'certificates' },
        { label: 'Trade Fair / Exhibition', value: 'exhibition' },
        { label: 'Factory / Warehouse', value: 'factory' },
      ],
    },
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'mediaType', type: 'select', options: ['image', 'video'], defaultValue: 'image' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
