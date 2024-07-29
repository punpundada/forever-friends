"use client";
import React from "react";
import { Form } from "../ui/form";
import InputControl from "../form-control/InputControl";
import {
  saveUser,
  SaveUserState,
  verifyVerificationCode,
} from "@/actions/authActions";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

const defaultValues:SignupType = {
  email: "",
  id: "",
  name: "",
  password: "",
  role:"USER"
};

const SinupForm = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [state, formAction, isPending] = useFormState<SaveUserState, FormData>(
    saveUser,
    {
      data: defaultValues,
      message: "",
      isSuccess: false,
    }
  );

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const form = useForm<SignupType>({
    defaultValues: {
      email: "",
      id: "",
      name: "",
      password: "",
      ...(state.data ?? {}),
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
      setOpen(true);
    }
  }, [state]);

  React.useEffect(() => {
    if (otp.length === 8) {
      const fetchData = async () => {
        const isValidOTP = await verifyVerificationCode(otp);
        toast(isValidOTP ? "Success" : "Error", {
          description: isValidOTP
            ? "Email varified successfully"
            : "Email varification failed",
          duration: 3000,
        });
        setOpen(false)
        setOtp("");
        router.push("/")
      };
      fetchData();
    }
  }, [otp,router]);


  return (
    <>
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
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OTP Varification</DialogTitle>
            <DialogDescription>Enter OTP send to your Email</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center">
            <InputOTP
              maxLength={8}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SinupForm;
