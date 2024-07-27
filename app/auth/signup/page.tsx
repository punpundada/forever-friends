import React from "react";
import signupImage from "@/assets/undraw_undraw_undraw_undraw_sign_up_ln1s_-1-_s4bc_-1-_ee41_-1-_kf4d.svg";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SinupForm from "@/components/form/SinupForm";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:flex justify-center items-center">
        <Image src={signupImage} height={400} width={400} alt="Login Image" />
      </div>
      <div className="flex justify-center items-center">
        <Card className="w-[90%] md:w-4/5">
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>
              Join <strong>Friends Forever</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SinupForm />
          </CardContent>
          <CardFooter>
            <span>Already have an account <Link href={'/auth/login'} className="font-semibold hover:underline">Login</Link></span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
