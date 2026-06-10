import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'visible', 'publishedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Company News', value: 'company' },
        { label: 'New Products', value: 'products' },
        { label: 'Export Updates', value: 'export' },
        { label: 'Trade Fair / Exhibition', value: 'exhibition' },
        { label: 'Announcements', value: 'announcements' },
      ],
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
