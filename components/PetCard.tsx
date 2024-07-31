"use client"
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { PetSelectType } from "@/types/pets";
import { useRouter } from "next/navigation";

export type CardPet = Omit<
  PetSelectType,
  "age" | "breed" | "available" | "userId" | "assignedTo" | "createdAt" | "updatedAt"
>;
type Props = {
  pet: CardPet;
};

const PetCard = ({ pet }: Props) => {
  const router = useRouter();
  return (
    <Card className="w-full hover:scale-105 transition-all cursor-pointer" onClick={()=>router.push(`${pet.id}`)}>
      <CardHeader>
        <CardTitle className="text-xl">{pet.name}</CardTitle>
        <CardDescription>{pet.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[60%]">
        <img src={pet.imageUrl[0]} alt={pet.name} className="object-cover h-full w-full" />
      </CardContent>
      <CardFooter className="h-[20%]">
        <span>Location: {pet.location}</span>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
