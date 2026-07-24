import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type SanityWebhookBody = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json({ message: "Missing revalidation secret." }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<SanityWebhookBody>(request, secret);

  if (!isValidSignature) {
    return Response.json({ message: "Invalid signature." }, { status: 401 });
  }

  if (body?._type) {
    revalidateTag(body._type, "max");
  }

  if (body?._type === "project" && body.slug?.current) {
    revalidatePath(`/projects/${body.slug.current}`);
    revalidatePath("/projects");
  }

  if (body?._type === "article" && body.slug?.current) {
    revalidatePath(`/articles/${body.slug.current}`);
    revalidatePath("/articles");
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/experience");
  revalidatePath("/contact");

  return Response.json({ revalidated: true, now: Date.now() });
}
