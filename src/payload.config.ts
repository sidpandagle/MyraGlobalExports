import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

import { Products } from './collections/Products'
import { Certificates } from './collections/Certificates'
import { Gallery } from './collections/Gallery'
import { Partners } from './collections/Partners'
import { Testimonials } from './collections/Testimonials'
import { News } from './collections/News'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { SiteSettings } from './collections/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Myra Global Admin',
    },
  },
  collections: [Products, Certificates, Gallery, Partners, Testimonials, News, Inquiries, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI ?? '' } }),
})
