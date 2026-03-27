import { z } from 'zod';

const envSchema = z.object({
  // Required env vars for production
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET should be at least 32 characters'),
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
  
  // Optional but recommended for full functionality
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_HOST: z.string().optional(),
  
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export function validateEnv() {
  try {
    const env = envSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_HOST: process.env.EMAIL_HOST,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      console.error(`\x1b[31m[CRITICAL ERROR] Missing or invalid environment variables: ${missingVars}\x1b[0m`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Exit process in production if env is invalid
      }
    }
    throw error;
  }
}

// Automatically validate on import
export const env = validateEnv();
