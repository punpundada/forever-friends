"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

type LastBy = "Last 24H" | "Last Week" | "Last Month";


const RecentsDropDown = () => {
  const [lastBy, setLastBy] = React.useState<LastBy>("Last 24H");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"sm"} className="space-x-2">
          <span>{lastBy}</span>
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Time Frame</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={lastBy}
          onValueChange={(s) => setLastBy(s as LastBy)}
        >
          <DropdownMenuRadioItem value="Last 24H">Last 24H</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Last Week">Last Week</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Last Month">Last Month</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentsDropDown;
