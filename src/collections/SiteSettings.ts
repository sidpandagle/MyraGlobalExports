import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    {
      name: 'sections',
      type: 'group',
      label: 'Show/Hide Website Sections',
      fields: [
        { name: 'showProducts', type: 'checkbox', defaultValue: true, label: 'Products Section' },
        { name: 'showCertificates', type: 'checkbox', defaultValue: true, label: 'Certificates Section' },
        { name: 'showPartners', type: 'checkbox', defaultValue: true, label: 'Partners & Suppliers Section' },
        { name: 'showGallery', type: 'checkbox', defaultValue: true, label: 'Gallery Section' },
        { name: 'showTeam', type: 'checkbox', defaultValue: true, label: 'Team Section' },
        { name: 'showTestimonials', type: 'checkbox', defaultValue: true, label: 'Testimonials Section' },
        { name: 'showNews', type: 'checkbox', defaultValue: true, label: 'News & Updates Section' },
        { name: 'showSocialMedia', type: 'checkbox', defaultValue: true, label: 'Social Media Links' },
        { name: 'showExportMarkets', type: 'checkbox', defaultValue: true, label: 'Export Markets Section' },
        { name: 'showContactInfo', type: 'checkbox', defaultValue: true, label: 'Contact Information' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '+91 XXXXXXXXXX' },
        { name: 'whatsapp', type: 'text', defaultValue: '+91 XXXXXXXXXX' },
        { name: 'email', type: 'email', defaultValue: 'info@myraglobalexports.com' },
        { name: 'salesEmail', type: 'email', defaultValue: 'sales@myraglobalexports.com' },
        { name: 'address', type: 'textarea' },
        { name: 'businessHours', type: 'textarea', defaultValue: 'Monday–Saturday: 9:00 AM – 6:00 PM IST' },
        { name: 'googleMapsEmbedUrl', type: 'text' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'whatsapp', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'downloads',
      type: 'group',
      label: 'Downloadable Files',
      fields: [
        { name: 'companyProfile', type: 'upload', relationTo: 'media' },
        { name: 'productCatalogue', type: 'upload', relationTo: 'media' },
        { name: 'productBrochure', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
