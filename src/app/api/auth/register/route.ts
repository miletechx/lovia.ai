import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type TurnstileVerifyResult = {
  success: boolean;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!turnstileToken) {
      return Response.json({ error: "请先完成人机验证。" }, { status: 403 });
    }

    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const verifyResult = (await verifyResponse.json()) as TurnstileVerifyResult;

    if (!verifyResult.success) {
      return Response.json({ error: "人机验证失败，请重试" }, { status: 403 });
    }

    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existingUser) {
      return Response.json({ error: "Email or username is already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username: username || null,
        name: username || email.split("@")[0],
        passwordHash,
        ageConfirmed: true,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create account." }, { status: 500 });
  }
}
