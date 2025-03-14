import { generateLogo } from "@/services/generate-logo";
import { FormLogoValues } from "@/global.types";
import { auth } from "@clerk/nextjs/server";
import { storeLogo } from "@/services/store-logo";

export const maxDuration = 60;

export async function POST(request: Request) {
  const payload: FormLogoValues = await request.json();
  const { userId } = await auth();
  try {
    const result = await generateLogo(payload);
    await storeLogo({
      userId: userId!,
      name: payload.name,
      description: payload.description,
      image: result,
    });
    return Response.json({ data: result });
  } catch (e) {
    console.error("failed generate logo:", e);
    return new Response(null, { status: 500 });
  }
}