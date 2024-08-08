"use server";

import prisma from "@/lib/prisma";
import {
  adoptionCenterInertSchema,
  AdoptionCenterInsert,
  AdoptionCenterSelect,
} from "@/types/adoptionCeter";
import { DefaultState } from "@/types/util";
import React from "react";
import { getErrorResponse } from "@/lib/utils";
import getUser from "./userActions";
import { redirect } from "next/navigation";

export const saveAdoptionCenter = React.cache(
  async (
    prevState: DefaultState<AdoptionCenterInsert, AdoptionCenterSelect>,
    data: FormData
  ): Promise<DefaultState<AdoptionCenterInsert, AdoptionCenterSelect>> => {
    const formData = Object.fromEntries(data);
    try {
      const validCnterData = adoptionCenterInertSchema.parse(formData);
      const savedCenter = await prisma.adoptionCenter.create({
        data: validCnterData,
      });

      return {
        defaultValues: validCnterData,
        isSuccess: true,
        message: "Saved Successfully",
        response: savedCenter as any,
      };
    } catch (error) {
      return getErrorResponse({
        error,
        formData: adoptionCenterInertSchema.safeParse(formData).data ?? (formData as any),
        schama: adoptionCenterInertSchema,
      });
    }
  }
);

export const getCenterCount = React.cache(async():Promise<number>=>{
return prisma.adoptionCenter.count()
})


export const getAdoptionCenterList = async () => {
  const user = await getUser()
  if(!user || user?.role !== 'SUPER_ADMIN'){
    return redirect('/')
  }
  return await prisma.adoptionCenter.findMany({
    select:{
      name:true,
      phoneNumber:true,
      email:true,
    }
  })
}