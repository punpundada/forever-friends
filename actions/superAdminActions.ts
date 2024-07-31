"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getUserListByEmail = async (email: string) => {
  try {
    if (!email || email.length === 0) {
      return [];
    }
    const useList = prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
        role: {
          not: "SUPER_ADMIN",
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        adoptionCenterId: true,
        role: true,
        isBanned: true,
      },
    });
    return useList;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const toggleUserActive = async (
  path: string,
  userId: string,
  isBanned: boolean
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBanned: !isBanned,
      },
      select: {
        id: true,
      },
    });
    if (updatedUser) {
      revalidatePath(path);
      return {
        message: !isBanned ? "User Banned Successfully" : "User Activated Successfully",
        isSuccess: true,
      };
    } else {
      return {
        message: "Someting went wrong",
        isSuccess: false,
      };
    }
  } catch (error: any) {
    return {
      message: error.message,
      isSuccess: false,
    };
  }
};
