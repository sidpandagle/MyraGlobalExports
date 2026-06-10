import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Supplier', value: 'supplier' },
        { label: 'Buyer', value: 'buyer' },
        { label: 'Partner', value: 'partner' },
        { label: 'Future Partner', value: 'future' },
      ],
    },
    { name: 'country', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
