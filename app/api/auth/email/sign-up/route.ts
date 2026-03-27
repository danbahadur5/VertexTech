import { auth } from "../../../../lib/auth";
import { apiResponse } from "../../../../lib/api-response";
import { logger } from "../../../../lib/logger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password || !body.name) {
      return apiResponse.error("Name, email and password are required", 400, "MISSING_FIELDS");
    }

    const result = await auth.api.signUpEmail({ body });
    
    logger.info(`New user registered: ${body.email}`);
    return apiResponse.success(result, "Registration successful", 201);
  } catch (e: any) {
    logger.error(`Registration failed for ${request.headers.get('x-forwarded-for') || 'unknown IP'}`, e);
    return apiResponse.error(
      e?.message || "Registration failed",
      400,
      "REGISTRATION_ERROR"
    );
  }
}

