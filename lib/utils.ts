import { DefaultState } from "@/types/util";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodObject } from "zod";
import { Prisma } from "@prisma/client";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type getErrorResponse<T> = {
  error: unknown;
  formData: T;
  schama: ZodObject<any>;
  uniqueFalureMsg?: string;
};

export function getErrorResponse<T, K>({
  error,
  formData,
  uniqueFalureMsg,
  schama,
}: getErrorResponse<T>): DefaultState<T, K> {
  if (error instanceof ZodError) {
    const msg = error.issues.map((x) => x.message).join(",");
    return {
      defaultValues: formData,
      message: msg,
      isSuccess: false,
      response: undefined,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      defaultValues: schama.parse(formData) as T,
      message: uniqueFalureMsg ?? "Unique constraint failed",
      isSuccess: false,
      response: undefined,
    };
  }
  return {
    defaultValues: schama.parse(formData) as T,
    message: "Someting went wrong",
    isSuccess: false,
    response: undefined,
  };
}
