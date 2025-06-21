import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, pwd } = await req.json();
  let token = "";

  try {
    const res = await fetch(process.env.LOGIN_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
        user: user,
        pwd: pwd,
      },
    });

    const data = await res.json();
    if (data !== "") {
      token = data;
    }
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
  if (token === "") {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
