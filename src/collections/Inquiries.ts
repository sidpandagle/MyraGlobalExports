import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'company', 'country', 'productRequired', 'createdAt'],
  },
  disableDuplicate: true,
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'productRequired', type: 'text', required: true },
    { name: 'quantity', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'whatsapp', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
      defaultValue: 'new',
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes' } },
  ],
  timestamps: true,
}
