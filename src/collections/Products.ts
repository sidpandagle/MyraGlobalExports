import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'visible', 'updatedAt'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'text', required: true, defaultValue: 'Agricultural' },
    { name: 'description', type: 'richText' },
    { name: 'shortDescription', type: 'textarea' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'specifications', type: 'richText' },
    { name: 'packagingInfo', type: 'textarea' },
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide from website' } },
    { name: 'featuredOnHome', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
