"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { UserTable } from "./ManageUserList";
import { toggleUserActive } from "@/actions/superAdminActions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type props = {
  user: UserTable;
};

const ManageUserActions = (props: props) => {
  const searchParams = useSearchParams();

  const handleBanUser = async () => {
    const data = await toggleUserActive(
      `/dashboard/user/promote?search=${searchParams.get("search")}`,
      props.user.id,
      props.user.isBanned
    );
    if (data.isSuccess) {
      toast.success(data.message);
      return;
    }
    toast.error(data.message);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {props?.user?.role === "USER" || props.user.role === "EMPLOYEE"
              ? "Promote"
              : "Demote"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleBanUser}>
            {props.user?.isBanned ? "Activate" : "Ban"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageUserActions;
