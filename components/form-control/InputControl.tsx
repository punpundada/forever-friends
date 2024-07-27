import React from "react";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputType<T extends FieldValues>
  extends React.ComponentPropsWithoutRef<"input"> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  defaultvalue?: PathValue<T, Path<T>>;
  type?:"text" | "email" | "number" | "password"
}

const InputControl = React.memo(<T extends FieldValues>(props: InputType<T>) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      disabled={props.disabled}
      defaultValue={props.defaultvalue}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);
          props.onChange && props.onChange(e);
        };
        const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
          field.onBlur();
          props.onBlur && props.onBlur(e);
        };
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                {...field}
                {...props}
                className={cn("w-full",props.className)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
});

InputControl.displayName = "InputControl";

export default InputControl;
