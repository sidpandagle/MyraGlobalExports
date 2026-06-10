import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'clientName' },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'content', type: 'textarea', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'type',
      type: 'select',
      options: ['buyer', 'supplier'],
      defaultValue: 'buyer',
    },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'featuredOnHome', type: 'checkbox', defaultValue: false },
  ],
}
