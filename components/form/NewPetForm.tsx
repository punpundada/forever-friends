"use client";
import { petInsertSchema, PetInsertType } from "@/types/pets";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { useFormState } from "react-dom";
import { savePetData } from "@/actions/petsAction";
import InputControl from "../form-control/InputControl";
import TextAreaControl from "../form-control/TextAreaControl";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const defaults: PetInsertType = {
  adoptionCenterId: 0,
  age: 0,
  available: true,
  breed: "",
  createdAt: new Date(),
  description: "",
  imageUrl: [],
  location: "",
  name: "",
  updatedAt: new Date(),
  assignedTo: "",
};

const NewPetForm = () => {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [state, formAction, isPending] = useFormState(savePetData, {
    defaultValues: defaults,
    isSuccess: false,
    message: "",
    response: undefined,
  });

  const form = useForm<PetInsertType>({
    defaultValues: defaults,
    resolver: zodResolver(petInsertSchema),
    mode: "onChange",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(() => {
      formAction(new FormData(formRef.current!));
    })(e);
  };
  /*
  adoptionCenterId: 0,
  age: 0,
  available: true,
  breed: "",
  createdAt: new Date(),
  description: "",
  imageUrl: [],
  location: "",
  name: "",
  updatedAt: new Date(),
  assignedTo:"",
*/
  return (
    <>
      <Form {...form}>
        <form
          action={formAction}
          onSubmit={onSubmit}
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <InputControl name="name" label="Pet Name" placeholder="Enter Pet Name" />
          <div className="row-span-2 col-span-2">
            <TextAreaControl
              className="h-full"
              formItemClassName="h-[77%]"
              name="description"
              label="Description"
              placeholder="Enter Pet Description"
            />
          </div>
          <InputControl name="age" label="Pet Age" placeholder="Enter Pet Age" />
          <InputControl name="breed" label="Pet breed" placeholder="Enter Pet breed" />
          <InputControl
            name="location"
            label="Pet location"
            placeholder="Enter Pet location"
          />
          <InputControl
            name="assignedTo"
            label="Pet assignedTo"
            placeholder="Enter Pet assignedTo"
          />
          <div className="col-span-full space-x-3">
            <Button>Save Details</Button>
            <Button variant={"outline"} type="button" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default NewPetForm;
