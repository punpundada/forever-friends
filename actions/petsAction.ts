"use server";

import prisma from "@/lib/prisma";
import { petInsertSchema, PetInsertType, PetSelectType } from "@/types/pets";
import { DefaultState } from "@/types/util";
import React from "react";
import getUser from "./userActions";
import { getErrorResponse } from "@/lib/utils";

export const getPetsCount = React.cache(async (adoptionCenterId?: number) => {
  const data = await prisma.pet.findMany({
    where: {
      available: true,
      adoptionCenterId: adoptionCenterId ?? undefined,
    },
    select: {
      id: true,
    },
  });
  return data.length;
});

export type SavePet = DefaultState<PetInsertType, PetSelectType>;

export const savePetData = React.cache(
  async (prevState: SavePet, data: FormData): Promise<SavePet> => {
    const formData = Object.fromEntries(data);
    try {
      const user = await getUser();
      if (!user || !user?.adoptionCenterId) {
        return {
          defaultValues: prevState.defaultValues,
          isSuccess: false,
          message: "Unvarified User",
          response: undefined,
          isCalled: true,
        };
      }
      formData.adoptionCenterId = 1 as any;
      formData.imageUrl = [
        "https://images.unsplash.com/photo-1526526431900-88eb525f1e4a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ] as any;
      const validPet = petInsertSchema.parse(formData);
      validPet.adoptionCenterId = user.adoptionCenterId;
      const savedPet = await prisma.pet.create({
        data: validPet,
      });
      if (!savedPet) {
        return {
          defaultValues: validPet,
          isSuccess: false,
          message: "Unvarified User",
          response: undefined,
          isCalled: true,
        };
      }
      return {
        defaultValues: validPet,
        isSuccess: true,
        message: "Pet Details saved successfully",
        response: savedPet,
        isCalled: true,
      };
    } catch (error) {
      return getErrorResponse({
        error,
        formData: petInsertSchema.safeParse(formData).data ?? (formData as any),
        schama: petInsertSchema,
      });
    }
  }
);

export const getPetCardList = async () => {
  try {
    return await prisma.pet.findMany({
      select: {
        id: true,
        description: true,
        name: true,
        imageUrl: true,
        location: true,
        adoptionCenterId: true,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPetById = async (id: number) => {
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: id,
      },
    });
    return pet;
  } catch (error) {
    return null;
  }
};
