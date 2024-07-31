import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { IdCardIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Kalam } from "next/font/google";
import { getUserProfile } from "@/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOutButton from "./LogOutButton";
/*
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dtaesvyis"
NEXT_PUBLIC_CLOUDINARY_API_KEY="324414194418576"
CLOUDINARY_API_SECRET="xY5BVB4GMGGza4sgd-4QBTrdDac"
*/
const kalam = Kalam({ subsets: ["latin"], weight: "700" });
const Navbar = async () => {
  const data = await getUserProfile();

  return (
    <div className="h-12 flex justify-between px-4 items-center">
      <NavigationMenu className=" p-4 w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] grid-cols-1 md:grid-cols-[.75fr_1fr]">
                <li className="row-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <IdCardIcon className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">Forever Friends</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Connecting pets with loving homes.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/events" title="Upcoming Events">
                  Check out our upcoming events.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
            <NavigationMenuContent className="w-full">
              <ul className="grid gap-3 w-[80vw] p-4 md:w-[400px] lg:w-[500px] grid-cols-1 md:grid-cols-2">
                <ListItem href="/about" title="Our Mission">
                  Learn about our mission and values.
                </ListItem>
                <ListItem href="/team" title="Our Team">
                  Meet the team behind Forever Friends.
                </ListItem>
                <ListItem href="/contact" title="Contact Us">
                  Get in touch with us.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Adopt</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 w-[80vw] p-4 md:w-[400px] lg:w-[500px] grid-cols-1 md:grid-cols-2">
                <ListItem href="/pets/adopt" title="Available Pets">
                  Browse pets available for adoption.
                </ListItem>
                <ListItem href="/pets/adoption-process" title="Adoption Process">
                  Learn about our adoption process.
                </ListItem>
                <ListItem href="/adoption-centers" title="Adoption Centers">
                  Find adoption centers near you.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 w-[80vw] p-4 md:w-[400px] lg:w-[500px] grid-cols-1 md:grid-cols-2">
                <ListItem href="/blog" title="Blog">
                  Read our latest articles and updates.
                </ListItem>
                <ListItem href="/faq" title="FAQ">
                  Frequently asked questions.
                </ListItem>
                <ListItem href="/support" title="Support">
                  Find support and resources.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {data?.user && data.user?.role !== "USER" && (
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex gap-4 items-center">
        <span className={cn("text-3xl tracking-wide", kalam.className)}>
          Forever Friends
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={data?.profile?.imageUrl ?? ""}
                alt={`@${data?.user.name}`}
              />
              <AvatarFallback className="text-xs">
                {data?.user?.name ?? "user"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {data?.user && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={"/user/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={"/user/settings"}>Settings</Link>
                  </DropdownMenuItem>
                  {data?.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href={"/team"}>Team</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/support"}>Support</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {!data?.user ? <Link href={"/auth/login"}>Login</Link> : <LogOutButton />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
          href={props.href ?? ""}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
