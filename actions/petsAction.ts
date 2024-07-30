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
        };
      }
      formData.adoptionCenterId = 1 as any;
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
        };
      }
      return {
        defaultValues: validPet,
        isSuccess: true,
        message: "Pet Details saved successfully",
        response: savedPet,
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
