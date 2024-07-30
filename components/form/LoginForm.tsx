"use client";
import React from "react";
import { Form } from "../ui/form";
import InputControl from "../form-control/InputControl";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { login } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const defaultValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [state, formAction, isPending] = useFormState(login, {
    defaultValues,
    isSuccess: false,
    message: "",
    response: undefined,
  });

  const form = useForm<LoginSchemaType>({
    defaultValues: { ...defaultValues, ...state.defaultValues },
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(() => {
      formAction(new FormData(formRef.current!));
    })(e);
  };

  React.useEffect(() => {
    if (state.isSuccess) {
      router.push("/");
      toast("Success", {
        description: state.message,
        action: <Button variant={"outline"}>Close</Button>,
      });
      return 
    } 
    if(!state.isSuccess && state.response)
      toast("Error", {
        description: state.message,
        action: <Button variant={"outline"}>Close</Button>,
      });
    
  }, [router, state]);

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="space-y-4 md:space-x-2"
        action={formAction}
        ref={formRef}
      >
        <InputControl
          name="email"
          label="Email"
          placeholder="example@gmail.com"
          disabled={isPending}
        />
        <InputControl
          name="password"
          label="Password"
          placeholder="Enter password"
          disabled={isPending}
          type="password"
          description={
            <span className="flex justify-end">
              <Link href={"/auth/forget-password"} className="hover:underline">
                Forgot password?
              </Link>
            </span>
          }
        />
        <Button type="submit" disabled={isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
