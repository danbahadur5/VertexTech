export type UserRole = 'admin' | 'editor' | 'client';
export interface User { id: string; name: string; email: string; role: UserRole; avatar?: string; status: 'active' | 'inactive'; createdAt: string; }
export interface Page { id: string; title: string; slug: string; blocks: ContentBlock[]; seo: SEOMetadata; status: 'draft' | 'published'; updatedAt: string; }
export interface ContentBlock { id: string; type: 'hero' | 'services' | 'features' | 'testimonials' | 'cta' | 'team' | 'timeline' | 'text' | 'image' | 'gallery'; content: any; order: number; }
export interface Service { id: string; title: string; slug: string; description: string; icon: string; illustration?: string; features: string[]; pricing?: { basic: number; professional: number; enterprise: number; }; seo: SEOMetadata; }
export interface BlogPost { id: string; title: string; slug: string; content: string; excerpt: string; featuredImage: string; category: string; tags: string[]; author: { id: string; name: string; avatar: string; }; seo: SEOMetadata; publishedAt: string; status: 'draft' | 'published'; }
export interface CaseStudy { id: string; title: string; slug: string; client: string; description: string; technologies: string[]; gallery: string[]; testimonial?: { quote: string; author: string; position: string; }; featured: boolean; completedAt: string; }
export interface SEOMetadata { metaTitle: string; metaDescription: string; keywords: string[]; ogImage?: string; }
export interface Theme { colors: { primary: string; secondary: string; accent: string; background: string; foreground: string; }; typography: { fontFamily: string; fontSize: { base: string; heading: string; }; }; spacing: { unit: number; }; borderRadius: { sm: string; md: string; lg: string; }; darkMode: boolean; }
export interface SupportTicket { id: string; userId: string; subject: string; description: string; status: 'open' | 'in-progress' | 'resolved' | 'closed'; priority: 'low' | 'medium' | 'high' | 'urgent'; responses: TicketResponse[]; createdAt: string; updatedAt: string; }
export interface TicketResponse { id: string; userId: string; userName: string; message: string; createdAt: string; }
export interface MediaFile { id: string; name: string; url: string; type: 'image' | 'document' | 'video'; size: number; uploadedAt: string; uploadedBy: string; }
export interface DashboardStats { users: number; pages: number; posts: number; projects: number; tickets: number; }
