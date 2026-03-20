DarbarTech is a Next.js 15 application with a full-stack content system for services, blog, case studies, pages, media, and a role-based dashboard (admin, editor, client). It uses MongoDB via Mongoose, Better Auth for authentication, and Cloudinary for media uploads. The frontend includes configurable content loaders to display skeletons until API data is ready.

## Tech Stack
- Next.js 15 (App Router)
- React 18
- MongoDB + Mongoose
- Better Auth (Next integration)
- Cloudinary uploads
- Radix UI + Tailwind utilities
- Zod for API validation

## Environments
Create a .env file with the following keys (do not commit secrets):
- MONGODB_URI=…
- AUTH_SECRET=…
- NEXTAUTH_URL=…
- CLOUDINARY_CLOUD_NAME=…
- CLOUDINARY_API_KEY=…
- CLOUDINARY_API_SECRET=…
- ADMIN_BOOTSTRAP_TOKEN=… (one-time admin promotion token)
- EMAIL_HOST=…
- EMAIL_USER=…
- EMAIL_PASS=…

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Content Model
- CaseStudy: title, slug, client, description, technologies[], gallery[], liveUrl, status(in-progress|completed), testimonial, featured, completedAt
- BlogPost: title, slug, content, excerpt, featuredImage, category, tags[], author, featured, publishedAt, status(draft|published)
- Service: title, slug, description, icon, features[], capabilities[], pricing, seo
- Page, MediaFile, SupportTicket, SiteSetting, AppUser

## API Endpoints (Server)
- /api/case-studies [GET, POST]
- /api/case-studies/[slug] [GET, PUT, DELETE]
- /api/blog [GET, POST]
- /api/blog/[slug] [GET, PUT, DELETE]
- /api/services [GET, POST]
- /api/services/[slug] [GET, PUT, DELETE]
- /api/media [GET]
- /api/media/upload [POST]
- /api/media/[publicId] [DELETE]
- /api/pages [GET, POST]
- /api/pages/[slug] [GET, PUT, DELETE]
- /api/enquiries/[id] [GET, PUT, DELETE]
- /api/admin/stats [GET]
- /api/users, /api/users/[id], /api/users/me

Most mutating routes require role-based authorization (admin/editor).

## Admin Bootstrap
1. Sign in to create a client account.
2. Call POST /api/admin/bootstrap with header x-bootstrap-token matching ADMIN_BOOTSTRAP_TOKEN to promote your session user to admin.

## Featured Content on Home
- Featured Projects section shows only case studies where featured=true.
- Latest from Our Blog shows only blog posts where featured=true and status=published.
- When no featured items are found, sections collapse into CTAs linking to /caseStudy and /blog.

## Content Loaders
The app includes a reusable content loader that shows skeletons until data is ready:
- File: app/components/ui/content-loader.tsx
- Integrated in:
  - Home featured projects and blog sections
  - Case studies list and detail pages
  - Blog list and post detail pages
  - Services section (home)

## Build & Quality
- Type check and build:

```bash
npm run build
```

> ESLint is configured but may require `eslint-config-next/core-web-vitals.js` path in eslint.config.mjs depending on your environment.

## Deployment
- Recommended: Vercel with Next.js App Router.
- Add environment variables in the deployment environment.
- Ensure MongoDB cluster is reachable from the deployment.
- Configure Cloudinary credentials and allowed domains in next.config.mjs images.remotePatterns.

## Security
- Do not commit .env or secrets.
- Role-based access control enforced on mutating endpoints.
- Media deletion and upload restricted to admin/editor.

## Troubleshooting
- Build errors around Mongoose findById overloads are mitigated by using findOne/findOneAndUpdate/findOneAndDelete with _id.
- If media uploads fail, verify Cloudinary credentials and folder permissions.
