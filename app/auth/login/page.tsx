import React from "react";
import loginImage from "@/assets/undraw_access_account_re_8spm.svg";
import Image from "next/image";
import LoginForm from "@/components/form/LoginForm";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1  md:grid-cols-2 h-screen p-6">
      <div className="justify-center items-center hidden md:flex">
        <Image src={loginImage} height={400} width={400} alt="Login Image" />
      </div>
      <div className="flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
