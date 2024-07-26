"use server";

import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginSchemaType, SignupSchema, SignupType } from "@/types/auth";
import { cookies } from "next/headers";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { DefaultState } from "@/types/util";
import { UserType } from "@/types/user";
import { getErrorResponse } from "@/lib/utils";

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

export const saveUser = async (
  prevState: SaveUserState,
  data: FormData
): Promise<SaveUserState> => {
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

    const session = await lucia.createSession(savedUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return {
      data: undefined,
      message: "User saved successfully",
      isSuccess: true,
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      const msg = error.issues.map((x) => x.message).join(",");
      return {
        data: undefined,
        message: msg,
        isSuccess: false,
      };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
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
};

export interface LoginData {
  defaultValues: LoginSchemaType;
  response: Omit<UserType, "password"> | undefined;
}

export const login = async (
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
      };
    }

    const isValidPassword = await varifyPassword(foundUser.password, validData.password);

    if (!isValidPassword) {
      return {
        response: undefined,
        defaultValues: validData,
        isSuccess: false,
        message: "Either Email or password is wrong",
      };
    }
    const session = await lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    const { password, ...rest } = foundUser;
    console.log('rest',rest);
    
    return {
      defaultValues: validData,
      response: rest,
      isSuccess: true,
      message: "Login success",
    };
  } catch (error) {
    return getErrorResponse({
      error,
      formData: loginSchema.parse(formData) ?? (formData as any),
      schama: loginSchema,
    });
  }
};
