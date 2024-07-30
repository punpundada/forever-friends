"use client";
import { sendRestPasswordLink } from "@/actions/authActions";
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
import { toast } from "sonner";

const ForgotPassword = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSendEmail = async () => {
    if (inputRef.current ) {
      const isSuccess = await sendRestPasswordLink(inputRef.current.value);
      if (isSuccess) {
        toast("Success", { description: `Email send to ${inputRef.current.value}` });
      }
    }
  };
  return (
    <div className="flex h-full">
      <div className="hidden md:block w-1/2">Image</div>
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <Card className="w-[90%] md:w-[70%]">
          <CardHeader>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>he</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="">
              <Input placeholder="Enter Email" ref={inputRef} />
            </div>
            <Button variant={"secondary"} onClick={handleSendEmail}>
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
