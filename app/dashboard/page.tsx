import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RecentsDropDown from "@/components/RecentsDropDown";
import { Card, CardContent } from "@/components/ui/card";

import React from "react";

const Dashboard = async () => {
  return (
    <Card className="h-full">
      <CardContent className="h-full">
        <div className="flex justify-between py-4">
          <span className="text-xl">This Month&apos;s adoptions</span>
          <DatePickerWithRange />
        </div>
        <div className="h-full md:h-[50%]">chart</div>
        <div className="flex justify-between">
          <span className="text-xl">Recent Activity</span>
          <RecentsDropDown />
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
