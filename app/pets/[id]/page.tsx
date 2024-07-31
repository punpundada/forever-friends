import { getPetById } from "@/actions/petsAction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import React from "react";

const PetDetails = async ({ params }: { params: { id: string } }) => {
  console.log(params);
  const pet = await getPetById(+params.id);
  if (!pet) {
    return redirect("/pets/adopt");
  }
  return (
    <div className="h-full flex justify-center items-center p-4">
      <Card className="h-full w-[60%]">
        <CardHeader>
          <CardTitle>{pet.name}</CardTitle>
          <CardDescription>{pet.description}</CardDescription>
          <CardContent>
            <img src={pet.imageUrl[0]} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PetDetails;
