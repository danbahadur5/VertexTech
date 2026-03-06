import { toNextJsHandler } from "better-auth/next-js";

async function getHandler() {
  const { auth } = await import("../../../lib/auth");
  return toNextJsHandler(auth);
}

export const GET = async (...args: any[]) => {
  const h = await getHandler();
  // @ts-ignore
  return h.GET(...args);
};

export const POST = async (...args: any[]) => {
  const h = await getHandler();
  // @ts-ignore
  return h.POST(...args);
};
