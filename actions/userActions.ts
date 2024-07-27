"use server";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserType } from "@/types/user";
import { cookies } from "next/headers";
import React from "react";

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
  } catch(err) {
    console.error(err)
  }
  return user;
});

export const updateUser = React.cache(async (userId:string,user:Omit<UserType,"password">)=>{
  return await prisma.user.update({
    where:{
      id:userId
    },
    data:{
      email:user.email,
      email_verified:user.email_verified,
      name:user.name,
    }
  })
})


export default getUser;
