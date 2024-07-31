import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Option } from "@/types/util";

interface ComboboxControl<T extends FieldValues>
  extends React.ComponentPropsWithoutRef<"select"> {
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder: string;
  description?: string;
}

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const ComboboxControl = <T extends FieldValues>(props: ComboboxControl<T>) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Language</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)?.label
                  : "Select framework..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {framework.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ComboboxControl;
/*

<FormField
  control={form.control}
  name={props.name}
  render={({ field }) => (
    <FormItem className="flex flex-col w-full space-y-4">
      <FormLabel className="">{props.label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? props.options.find((option) => option.value === field.value)?.label
                : "Select "+props.label}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${props.label}...` }className="h-9" />
            <CommandList>
              <CommandEmpty>No {props.placeholder ?? "Item"} found.</CommandEmpty>
              <CommandGroup>
                {props.options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={(currVal) => {
                        console.log(currVal);
                        
                      form.setValue(props.name, option.value as any);
                    }}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        option.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>{props.description}</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
*/
