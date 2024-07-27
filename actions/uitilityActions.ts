"use server"
import prisma from "@/lib/prisma";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import env from "@/lib/env";
import nodemailer from "nodemailer";



export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await prisma.email_Verification.delete({
    where: {
      userId: userId,
    },
  });

  const code = generateRandomString(8, alphabet("0-9"));
  await prisma.email_Verification.create({
    data: {
      userId: userId,
      email,
      code,
      expires_at: createDate(new TimeSpan(15, "m")),
    },
  });
  return code;
}


export const createTransporter = async () => {
  const transporterObj = {
    host: env.SMTP_HOST!,
    port: env.SMTP_PORT!,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER!, // generated brevo user
      pass: env.SMTP_PASS!, // generated brevo password
    },
  };

  return nodemailer.createTransport(transporterObj as any);
};
