import getUser from "@/actions/userActions";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUser();
  if (user) {
    redirect("/");
  }
  return children;
};

export default layout;
