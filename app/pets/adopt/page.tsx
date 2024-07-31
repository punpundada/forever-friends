import { getPetCardList } from "@/actions/petsAction";
import PetCard from "@/components/PetCard";
import React from "react";

const AdoptablePetsList = async () => {
  const cardList = await getPetCardList();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {cardList.map((pet) => (
        <PetCard pet={pet} key={pet.id} />
      ))}
    </div>
  );
};

export default AdoptablePetsList;
