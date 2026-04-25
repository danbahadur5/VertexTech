import mongoose, { Schema, models, model } from "mongoose";

const RoleEnum = ["admin", "editor", "client"] as const;

const AppUserSchema = new Schema(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: RoleEnum, default: "client", index: true },
    avatar: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PricingSchema = new Schema(
  {
    basic: { type: Number },
    professional: { type: Number },
    enterprise: { type: Number },
  },
  { _id: false }
);

const SEOSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: [String], default: [] },
    ogImage: { type: String },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    tagline: { type: String },
    icon: { type: String, default: "Code" },
    illustration: { type: String },
    features: { type: [String], default: [] },
    capabilities: {
      type: [
        new Schema(
          {
            label: { type: String },
            value: { type: Number },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    pricing: { type: PricingSchema, default: {} },
    seo: { type: SEOSchema, default: {} },
  },
  { timestamps: true }
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    featuredImage: { type: String },
    category: { type: String },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    author: {
      id: { type: String },
      name: { type: String },
      avatar: { type: String },
    },
    seo: { type: SEOSchema, default: {} },
    publishedAt: { type: Date },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    client: { type: String, required: true },
    clientId: { type: String, index: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    gallery: { type: [String], default: [] },
    liveUrl: { type: String },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress", index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    features: {
      type: [
        new Schema(
          {
            label: { type: String, required: true },
            status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    testimonial: {
      quote: { type: String },
      author: { type: String },
      position: { type: String },
    },
    featured: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const ContentBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    blocks: { type: [ContentBlockSchema], default: [] },
    seo: { type: SEOSchema, default: {} },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    updatedAtISO: { type: String },
  },
  { timestamps: true }
);

const MediaFileSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number },
    uploadedBy: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SupportTicketSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    responses: [
      {
        id: { type: String },
        userId: { type: String },
        userName: { type: String },
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const VerificationTokenSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    purpose: { type: String, enum: ["email-verification", "password-reset"], required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const RevisionSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: String },
    updatedAt: { type: Date, default: Date.now },
    comment: { type: String },
  },
  { _id: true }
);

const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, default: {} },
    revisions: { type: [RevisionSchema], default: [] },
    updatedAtISO: { type: String },
  },
  { timestamps: true }
);

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    company: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read"], default: "new", index: true },
  },
  { timestamps: true }
);

export const AppUser = models.AppUser || model("AppUser", AppUserSchema);
export const Service = models.Service || model("Service", ServiceSchema);
export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
export const CaseStudy = models.CaseStudy || model("CaseStudy", CaseStudySchema);
export const Page = models.Page || model("Page", PageSchema);
export const MediaFile = models.MediaFile || model("MediaFile", MediaFileSchema);
export const SupportTicket = models.SupportTicket || model("SupportTicket", SupportTicketSchema);
export const VerificationToken = models.VerificationToken || model("VerificationToken", VerificationTokenSchema);
export const SiteSetting = models.SiteSetting || model("SiteSetting", SiteSettingSchema);
export const Enquiry = models.Enquiry || model("Enquiry", EnquirySchema);

const ActivitySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    userAvatar: { type: String },
    action: { type: String, required: true }, // e.g., "Published blog post", "Updated service"
    type: { type: String, enum: ["user", "content", "support", "system"], default: "system", index: true },
    targetId: { type: String }, // ID of the related object (blog post, user, etc.)
    targetName: { type: String }, // Name/Title of the related object
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Activity = models.Activity || model("Activity", ActivitySchema);
