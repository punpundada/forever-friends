"use client";
import {
  adoptionCenterInertSchema,
  AdoptionCenterInsert,
  AdoptionCenterSelect,
} from "@/types/adoptionCeter";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import InputControl from "../form-control/InputControl";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { saveAdoptionCenter } from "@/actions/adoptioCeterActios";
import { DefaultState } from "@/types/util";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const defaultValues: AdoptionCenterInsert = {
  country: "India",
  state: "",
  email: "",
  name: "",
  phoneNumber: "",
  pincode: "",
  street: "",
  landmark: "",
} as any;

const formState: DefaultState<AdoptionCenterInsert, AdoptionCenterSelect> = {
  defaultValues,
  isSuccess: false,
  message: "",
  response: undefined,
};

const NewAdoptionCenterForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useFormState<
    DefaultState<AdoptionCenterInsert, AdoptionCenterSelect>,
    FormData
  >(saveAdoptionCenter, formState);

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<AdoptionCenterInsert>({
    defaultValues,
    resolver: zodResolver(adoptionCenterInertSchema),
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
      toast("Success", {
        description: state.message,
      });
      router.push("/dashboard");
    }
    if(!state.isSuccess && state.response){
      toast("Error", {
        description: state.message,
      });
    }
  }, [state, toast, router]);

  return (
    <>
      <Form {...form}>
        <form
          action={formAction}
          ref={formRef}
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="col-span-1 md:col-span-2">
            <InputControl name="name" label="Name*" placeholder="Enter Name" />
          </div>
          <InputControl name="email" label="Email*" placeholder="example@hotmail.com" />
          <InputControl
            name="phoneNumber"
            label="Phone Number*"
            placeholder="Enter Phone number"
          />
          <InputControl name="country" label="Country*" placeholder="Enter Country" />
          <InputControl name="state" label="State*" placeholder="Enter State" />
          <InputControl
            name="pincode"
            maxLength={6}
            label="PINCODE*"
            placeholder="Enter PINCODE"
          />
          <InputControl name="street" label="Street*" placeholder="Enter Street" />
          <InputControl name="landmark" label="land Mark" placeholder="Enter Land Mark" />
          <div className="col-span-full space-x-4">
            <Button>Save Details</Button>
            <Button type="button" onClick={()=>router.back()} variant={'secondary'}>Back</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default NewAdoptionCenterForm;
