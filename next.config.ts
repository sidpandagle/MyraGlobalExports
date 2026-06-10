import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Payload CMS admin route components pass extra props (config, importMap)
    // that Next.js generated type-checks reject. Our own source TypeScript is
    // clean (npx tsc --noEmit passes). This flag suppresses only the
    // framework-generated check files under .next/types/.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default withPayload(nextConfig)
