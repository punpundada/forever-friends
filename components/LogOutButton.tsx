"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/authActions";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";

const LogOutButton = () => {
  const router = useRouter();
  const handleLogout = () => {
    logout();
    toast.success("User logout successfully")
    router.prefetch("");
    router.refresh();
  };
  return (
    <>
      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
        Logout
      </DropdownMenuItem>
    </>
  );
};

export default LogOutButton;
