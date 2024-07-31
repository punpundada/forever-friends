import { PrismaClient } from "@prisma/client";
import env from "./env";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [],
  });
};
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
