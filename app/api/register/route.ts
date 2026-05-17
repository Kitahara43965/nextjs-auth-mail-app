import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { RegisterErrors } from "@/types/auth";
import crypto from "crypto";
import { transporter } from "@/lib/mail";

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json();

  const registerErrors: RegisterErrors = {};

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!name) registerErrors.name = "ユーザー名を入力してください";
  if (!email || !email.includes("@"))
    registerErrors.email = "正しいメールアドレスを入力してください";
  if (!password || password.length < 8)
    registerErrors.password = "パスワードは8文字以上で入力してください";
  if (password !== confirmPassword)
    registerErrors.confirmPassword = "パスワードが一致しません";
  if (existing) registerErrors.email = "ユーザーはすでに存在します";

  if (Object.keys(registerErrors).length > 0) {
    return Response.json({ registerErrors }, { status: 400 });
  }

  const hashed = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      login_time_number: 0,
      is_email_verified: false,
    },
  });

  // 🔥 トークン作成
  const verifyToken = crypto.randomBytes(32).toString("hex");

  // 🔥 保存（ここが重要）
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verifyToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1時間
    },
  });

  // 🔥 メール送信（リンク付きにする）
  await transporter.sendMail({
    from: "test@example.com",
    to: user.email,
    subject: "メール認証",
    text: `以下をクリックして認証してください:
http://localhost:3000/verify?token=${verifyToken}`,
  });

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
