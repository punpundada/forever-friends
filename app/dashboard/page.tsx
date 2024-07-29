import getUser, { getUserProfile } from "@/actions/userActions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const Dashboard = async () => {
  const data = await getUserProfile();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-end gap-3">
            <Avatar>
              <AvatarImage src={data?.profile?.imageUrl ?? ""} alt={`@${data?.user.name}`} />
              <AvatarFallback className="text-xs">{data?.user?.name}</AvatarFallback>
            </Avatar>

        </CardTitle>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card>
  );
};

export default Dashboard;
