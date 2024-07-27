import { DefaultState } from "@/types/util";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodObject } from "zod";
import { Prisma } from "@prisma/client";
import { FieldValues, SubmitHandler } from "react-hook-form";

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

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error?.code === "P2002"
  ) {
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

export const emailOtpHTML = ({
  name,
  validFor,
  otp,
}: {
  name: string;
  validFor: string;
  otp: string;
}) => {
  return `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${name}</a>
  </div>
  <p style="font-size:1.1em">Hi,</p>
  <p>Thank you for choosing ${name}. Use the following OTP to complete your Sign Up procedures. OTP is valid for ${validFor}</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
  <p style="font-size:0.9em;">Regards,<br />${name}</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>${name}</p>
    <p>1600 Amphitheatre Parkway</p>
    <p>California</p>
  </div>
</div>
</div>
  `;
};

export const REGEXP_ONLY_DIGITS = "^\d+$"