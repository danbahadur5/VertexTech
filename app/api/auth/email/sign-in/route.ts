import { auth } from "../../../../lib/auth";
import { apiResponse } from "../../../../lib/api-response";
import { logger } from "../../../../lib/logger";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return apiResponse.error("Email and password are required", 400, "INVALID_CREDENTIALS");
    }

    const result = await auth.api.signInEmail({ body });
    
    logger.info(`Successful login for user: ${body.email}`);
    return apiResponse.success(result, "Login successful");
  } catch (e: any) {
    logger.warn(`Failed login attempt: ${e?.message || "unknown error"}`);
    return apiResponse.error(
      e?.message === "sign_in_failed" ? "Invalid email or password" : (e?.message || "Login failed"),
      401,
      "AUTH_ERROR"
    );
  }
}

