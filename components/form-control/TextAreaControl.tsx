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
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface InputType<T extends FieldValues>
  extends React.ComponentPropsWithoutRef<"textarea"> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  defaultvalue?: PathValue<T, Path<T>>;
  type?:"text" | "email" | "number" | "password",
  formItemClassName?:string
}

const TextAreaControl = React.memo(<T extends FieldValues>(props: InputType<T>) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      disabled={props.disabled}
      defaultValue={props.defaultvalue}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          field.onChange(e);
          props.onChange && props.onChange(e);
        };
        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
          field.onBlur();
          props.onBlur && props.onBlur(e);
        };
        return (
          <FormItem className={cn(props.formItemClassName)}>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Textarea
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

TextAreaControl.displayName = "TextAreaControl";

export default TextAreaControl;
