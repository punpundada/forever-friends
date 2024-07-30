"use client";
import { verifyToken } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const VerifyResetPassword = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const reEnterPasswordInputRef = React.useRef<HTMLInputElement>(null);
  const disableState = !(
    passwordInputRef.current?.value && reEnterPasswordInputRef.current?.value
  );

  const handleResetPassword = async () => {
    const pass = passwordInputRef.current;
    const reenterPass = reEnterPasswordInputRef.current;
    if (pass?.value && reenterPass?.value) {
      const data = await verifyToken({
        password: pass?.value,
        reEnterPassword: reenterPass?.value,
        token: params.token,
      });

      if (data.isSuccess) {
        toast("Success", { description: data.message });
        router.push("/");
        return;
      }
      toast("Error", { description: data.message });
    }
  };
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Enter New Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input ref={passwordInputRef} placeholder="Enter Password" type="password" />
          <Input
            ref={reEnterPasswordInputRef}
            placeholder="Re-Enter Password "
            type="password"
          />
          {!disableState && (
            <p className="text-destructive text-xs">Password Must match</p>
          )}
          <div>
            <Button onClick={handleResetPassword}>Rest Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyResetPassword;
