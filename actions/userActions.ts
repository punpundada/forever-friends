"use server";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserType } from "@/types/user";
import { cookies } from "next/headers";
import React from "react";
import { Option } from "@/types/util";

const getUser = React.cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return null;
  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch (err) {
    console.error(err);
  }
  return user;
});

export const updateUser = React.cache(
  async (userId: string, user: Omit<UserType, "password">) => {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: user.email,
        email_verified: user.email_verified,
        name: user.name,
        role: user.role,
      },
    });
  }
);

export const getUserRoleUserOptions = React.cache(async (): Promise<Option[]> => {
  const userList = await prisma.user.findMany({
    where: {
      role: "USER",
      adoptionCenterId: null,
    },
    select: {
      email: true,
      id: true,
    },
  });
  return userList.map((x) => ({ value: x.id, label: x.email }));
});

export default getUser;

export const getUserCount = React.cache(async () => {
  return prisma.user.count();
});

export const getUserProfile = React.cache(async () => {
  const user = await getUser();
  if (!user) return undefined;
  const pro = await prisma.profile.findUnique({
    where: {
      userId: user?.id,
    },
  });
  return { profile: pro, user } ?? undefined;
});

export const getUserOptionsByCenterId = React.cache(async (): Promise<Option[]> => {
  try {
    const user = await getUser();
    if (!user || !user?.adoptionCenterId) {
      return [];
    }
    const users = await prisma.user.findMany({
      where: {
        adoptionCenterId: user.adoptionCenterId,
      },
      select: {
        name: true,
        id: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const list = users.map((x) => ({ value: x.id, label: x.name }));
    return list;
  } catch (error) {
    console.error(error);
    return [];
  }
});
