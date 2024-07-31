import { getCenterCount } from "@/actions/adoptioCeterActios";
import { getPetsCount } from "@/actions/petsAction";
import getUser, { getEmployeeCount, getUserCount } from "@/actions/userActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const DashoardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, count, userCount] = await Promise.all([
    getUser(),
    getCenterCount(),
    getUserCount(),
  ]);
  let employeeCount = user?.adoptionCenterId ? 1 : 0;
  if (user?.role === "ADMIN" && user?.adoptionCenterId) {
    employeeCount = await getEmployeeCount(user?.adoptionCenterId);
  }
  const petsCount = getPetsCount(user?.adoptionCenterId);

  if (!user || user?.role === "USER") {
    redirect("/");
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-[.20fr_.80fr] h-full">
      <Card className="h-full mx-2">
        <CardContent className="flex flex-col bg-accent text-accent-foreground ps-4 pt-2 h-full">
          <div className="flex-grow">
            <div>
              <p className="font-semibold">Overview</p>
              {user?.role === "SUPER_ADMIN" && (
                <div className="text-sm py-4 flex justify-between px-3 items-center">
                  <div>
                    <span className="text-xs block">Adoption centers</span>
                    <span className="text-center text-lg">{count}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"link"} size={"sm"}>
                        <DotsVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36">
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/adoption-center/list"} className="">
                            List
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/adoption-center/new"} className="">
                            New
                          </Link>
                        </DropdownMenuItem>
                      </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {user?.role === "SUPER_ADMIN" && (
                <div className="text-sm py-4 flex justify-between px-3 items-center">
                  <div>
                    <span className="text-xs block">Users</span>
                    <span className="text-center text-lg">{userCount}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"link"} size={"sm"} className="ms-2">
                        <DotsVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36">
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/user/create"}>Create New User</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/user/promote"} className="">
                            Promote / Demote
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/user/list"} className="">
                            List
                          </Link>
                        </DropdownMenuItem>
                      </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {user?.role === "ADMIN" && (
                <div className="text-sm py-4 flex justify-between px-3 items-center">
                  <div>
                    <span className="text-xs block">Employee</span>
                    <span className="text-center text-lg">{employeeCount}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"link"} size={"sm"} className="ms-2">
                        <DotsVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/user/enroll"}>Enroll Employee</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/user/list"} className="">
                            List
                          </Link>
                        </DropdownMenuItem>
                      </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="text-sm py-4 flex justify-between px-3 items-center">
                <div>
                  <span className="text-xs block">Rescued pet</span>
                  <span className="text-center text-lg">{petsCount}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"link"} size={"sm"} className="ms-2">
                      <DotsVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36">
                    <>
                      {user?.role !== "SUPER_ADMIN" && (
                        <DropdownMenuItem asChild>
                          <Link href={"/dashboard/pets/add"}>Add Rescue pet</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={"/dashboard/pets/list"} className="">
                          List
                        </Link>
                      </DropdownMenuItem>
                    </>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="h-[30%]">
            <span className="font-semibold">Analytics</span>
          </div>
        </CardContent>
      </Card>
      <div className="pr-1">{children}</div>
    </div>
  );
};

export default DashoardLayout;
