"use server";
import env from "@/lib/env";
import prisma from "@/lib/prisma";
import { UserType } from "@/types/user";
import React from "react";

// export const createSuperAdmin = React.cache(async () => {
//     const user:UserType={
//         email:env.SUPER_ADMIN_EMAIL,
//         email_verified:true,
//         id:"super_id",
//         name:"Super Admin",
//         password:env.SUPER_ADMIN_PASSWORD,
//         role:"SUPER_ADMIN"
//     }
//     const exist = await prisma.user.findFirst({
//         where:{
//             id:user.id
//         }
//     })
//     if(exist){

//     }
// })