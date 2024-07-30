import React from "react";
import loginImage from "@/assets/undraw_access_account_re_8spm.svg";
import Image from "next/image";
import LoginForm from "@/components/form/LoginForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const LoginPage = async() => {

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 h-screen p-6">
      <div className="justify-center items-center hidden md:flex">
        <Image src={loginImage} height={400} width={400} alt="Login Image" />
      </div>
      <div className="flex justify-center items-center">
      <Card className="w-[90%] md:w-[80%]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login To <strong>Forever Friends</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="text-sm">
        <span>
          Don&apos;t have an account?
          <Link className="font-semibold hover:underline ml-1" href={"/auth/signup"}>
            Signup
          </Link>{" "}
        </span>
      </CardFooter>
    </Card>
      </div>
    </div>
  );
};

export default LoginPage;
