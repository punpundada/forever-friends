"use client";

import React from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "./ui/button";

const SearchUserInput = () => {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");
  const debouncedState = useDebounce(value, 1000);

  const handleClearState = () => {
    router.push("/dashboard/user/promote");
    setValue("");
  };

  React.useEffect(() => {
    if (debouncedState && debouncedState !== "") {
      router.push("/dashboard/user/promote?search=" + debouncedState);
    } else {
      router.push("/dashboard/user/promote");
    }
  }, [debouncedState, router]);

  React.useEffect(() => {
    const ele = inputRef?.current;
    if (!ele) return;
    ele.focus();
  }, []);

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-[.50fr_.25fr]">
      <Input
        placeholder="Search User By Email"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        ref={inputRef}
      />
      <div>
        <Button variant={"outline"} onClick={handleClearState}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SearchUserInput;
