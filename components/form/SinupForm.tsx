"use client";
import React from "react";
import { Form } from "../ui/form";
import InputControl from "../form-control/InputControl";
import { saveUser, SaveUserState } from "@/actions/authActions";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const defaultValues = {
  email: "",
  id: "",
  name: "",
  password: "",
};

const SinupForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useFormState<SaveUserState, FormData>(saveUser, {
    data: defaultValues,
    message: "",
    isSuccess: false,
  });

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const form = useForm<SignupType>({
    defaultValues: {
      email: "",
      id: "",
      name: "",
      password: "",
      ...(state ?? {}),
    },
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(() => {
      formAction(new FormData(formRef.current!));
    })(e);
  };

  React.useEffect(() => {
    if (state.message !== "")
      toast(state.isSuccess ? "Success" : "Error", {
        description: state.message,
        closeButton: true,
        duration: 3000,
      });
    if (state.isSuccess) {
      router.push("/");
    }
  }, [router, state]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        action={formAction}
        className="space-y-4 md:space-y-2"
      >
        <InputControl
          name="name"
          label="Name"
          placeholder="Enter name"
          disabled={isPending}
        />
        <InputControl
          name="email"
          label="Email"
          placeholder="Enter Email"
          disabled={isPending}
        />
        <InputControl
          name="password"
          label="Password"
          placeholder="Enter Password"
          disabled={isPending}
          type="password"
        />
        <Button type="submit" disabled={isPending}>
          Signup
        </Button>
      </form>
    </Form>
  );
};

export default SinupForm;
