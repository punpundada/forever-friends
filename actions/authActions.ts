"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginSchemaType, SignupSchema, SignupType } from "@/types/auth";
import { cookies } from "next/headers";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { ZodError } from "zod";
import { DefaultState } from "@/types/util";
import { UserType } from "@/types/user";
import { emailOtpHTML, getErrorResponse } from "@/lib/utils";
import { createTransporter, generateEmailVerificationCode } from "./uitilityActions";
import env from "@/lib/env";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";
import React from "react";
import getUser, { updateUser } from "./userActions";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

async function getPasswordHash(password: string) {
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return passwordHash;
}

async function varifyPassword(password_hash: string, password: string) {
  return await verify(password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export type SaveUserState = {
  data: SignupType | undefined;
  message: string;
  isSuccess: boolean;
};

export const saveUser = React.cache(
  async (prevState: SaveUserState, data: FormData): Promise<SaveUserState> => {
    const formData = Object.fromEntries(data);
    try {
      formData.id = generateIdFromEntropySize(10);
      const validUser = SignupSchema.parse(formData);
      validUser.password = await getPasswordHash(validUser.password);
      const savedUser = await prisma.user.create({
        data: validUser,
        select: {
          id: true,
          email: true,
          name: true,
          password: false,
        },
      });
      const verificationCode = await generateEmailVerificationCode(
        savedUser.id,
        savedUser.email
      );
      const transporter = await createTransporter();
      const emailSend = await transporter.sendMail({
        from: env.EMAIL_FROM,
        subject: "Varification OTP",
        to: savedUser.email,
        html: emailOtpHTML({
          name: "Forever Friends",
          otp: verificationCode,
          validFor: "15 mins",
        }),
      });

      const session = await lucia.createSession(savedUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return {
        data: undefined,
        message: "User saved successfully",
        isSuccess: true,
      };
    } catch (error: any) {
      console.error(error.message);
      if (error instanceof ZodError) {
        const msg = error.issues.map((x) => x.message).join(",");
        return {
          data: undefined,
          message: msg,
          isSuccess: false,
        };
      }
      if (error?.code === "P2002") {
        return {
          data: SignupSchema.parse(formData),
          message: "Email id already exist",
          isSuccess: false,
        };
      }
      return {
        data: SignupSchema.parse(formData),
        message: error.message,
        isSuccess: false,
      };
    }
  }
);

export interface LoginData {
  defaultValues: LoginSchemaType;
  response: Omit<UserType, "password"> | undefined;
}

export const login = React.cache(
  async (
    prevState: DefaultState<LoginSchemaType, Omit<UserType, "password"> | undefined>,
    data: FormData
  ): Promise<DefaultState<LoginSchemaType, Omit<UserType, "password"> | undefined>> => {
    const formData = Object.fromEntries(data);
    try {
      const validData = loginSchema.parse(formData);

      const foundUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: validData.email,
          },
        },
      });

      if (!foundUser) {
        return {
          response: undefined,
          defaultValues: validData,
          isSuccess: false,
          message: "Either Email or password is wrong",
          isCalled: true,
        };
      }

      if (foundUser?.isBanned) {
        return {
          response: undefined,
          defaultValues: validData,
          isSuccess: false,
          message: "Either Email or password is wrong",
          isCalled: true,
        };
      }

      const isValidPassword = await varifyPassword(
        foundUser.password,
        validData.password
      );

      if (!isValidPassword) {
        return {
          response: undefined,
          defaultValues: validData,
          isSuccess: false,
          message: "Either Email or password is wrong",
          isCalled: true,
        };
      }
      const session = await lucia.createSession(foundUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      const { password, ...rest } = foundUser;

      return {
        defaultValues: validData,
        response: rest,
        isSuccess: true,
        message: "Login was successful",
        isCalled: true,
      };
    } catch (error) {
      return getErrorResponse({
        error,
        formData: loginSchema.safeParse(formData).data ?? (formData as any),
        schama: loginSchema,
      });
    }
  }
);

export const verifyVerificationCode = React.cache(
  async (code: string): Promise<boolean> => {
    const user = await getUser();
    if (!user) return false;
    const isValid = prisma.$transaction(async (tx) => {
      const databaseCode = await tx.email_Verification.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!databaseCode || databaseCode.code !== code) {
        return false;
      }
      await prisma.email_Verification.delete({
        where: {
          id: databaseCode.id,
        },
      });

      if (!isWithinExpirationDate(databaseCode.expires_at)) {
        return false;
      }
      if (databaseCode.email !== user.email) {
        return false;
      }
      return true;
    });
    if (!isValid) {
      return false;
    }
    user.email_verified = true;
    const [_, __, session] = await Promise.all([
      lucia.invalidateUserSessions(user.id),
      updateUser(user.id, user),
      lucia.createSession(user.id, {}),
    ]);
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return true;
  }
);

export const logout = React.cache(async () => {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return false;
    }
    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

const generateTokenHash = async (tokenId: string) => {
  return encodeHex(await sha256(new TextEncoder().encode(tokenId)));
};

async function createPasswordResetToken(userId: string): Promise<string> {
  const savedToken = await prisma?.passwordReset?.findFirst({
    where: { userId },
    select: {
      userId: true,
    },
  });
  if (savedToken) {
    // optionally invalidate all existing tokens
    await prisma.passwordReset.delete({
      where: {
        userId: userId,
      },
    });
  }
  const tokenId = generateIdFromEntropySize(25); // 40 character
  const tokenHash = await generateTokenHash(tokenId);

  await prisma.passwordReset.create({
    data: {
      token_hash: tokenHash,
      userId: userId,
      expiresAt: createDate(new TimeSpan(2, "h")),
    },
  });
  return tokenId;
}

const restPasswordEmail = (link: string) => {
  return `
  
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="https://rakeshmandal.com" title="logo" target="_blank">
                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${link}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
  `;
};

export const sendRestPasswordLink = async (email: string) => {
  console.log(email);

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return false;
  }
  const verificationToken = await createPasswordResetToken(user.id);
  const verificationLink = env.BASE_URL + verificationToken;

  const transporter = await createTransporter();
  const emailSend = await transporter.sendMail({
    from: env.EMAIL_FROM,
    subject: "Varification OTP",
    to: user.email,
    html: restPasswordEmail(verificationLink),
  });
  if (!emailSend.accepted) {
    return false;
  }
  return true;
};

export const verifyToken = async (data: {
  password: string;
  reEnterPassword: string;
  token: string;
}) => {
  if (data.password !== data.reEnterPassword) {
    return {
      isSuccess: false,
      message: "Password and re-enter password do not match",
    };
  }
  const tokenHash = await generateTokenHash(data.token);
  const savedToken = await prisma.passwordReset.findFirst({
    where: {
      token_hash: tokenHash,
    },
  });
  if (!savedToken) {
    return {
      isSuccess: false,
      message: "Invalid request",
    };
  }
  await prisma.passwordReset.delete({
    where: {
      token_hash: savedToken.token_hash,
    },
  });

  if (!isWithinExpirationDate(savedToken.expiresAt)) {
    return {
      isSuccess: false,
      message: "Link expired",
    };
  }

  await lucia.invalidateUserSessions(savedToken.userId);

  const hashPassword = await getPasswordHash(data.password);

  await prisma.user.update({
    where: {
      id: savedToken.userId,
    },
    data: {
      password: hashPassword,
    },
  });
  const session = await lucia.createSession(savedToken.userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return {
    isSuccess: true,
    message: "Password Reset successfully",
  };
};
