import { getUserListByEmail } from "@/actions/superAdminActions";
import ManageUserList from "@/components/manage-user/ManageUserList";
import SearchUserInput from "@/components/SearchUserInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

const Promote = async ({
  searchParams,
}: {
  searchParams?: {
    search?: string;
  };
}) => {
  const useList =
    searchParams?.search && searchParams?.search !== ""
      ? await getUserListByEmail(searchParams?.search)
      : [];
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
        <CardDescription>Promote or Demote user</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchUserInput />
        <ManageUserList users={useList} />
      </CardContent>
    </Card>
  );
};

export default Promote;
