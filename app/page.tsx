import bgImage from "@/assets/manja-vitolic-gKXKBY-C-Dk-unsplash.jpg";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="min-h-full flex justify-center items-end">
      <Image
        src={bgImage}
        fill
        alt="BgImage"
        className="object-cover blur-[1px] -z-10 select-none"
      />
      <div className="absolute top-[35%] left-[10%] uppercase space-y-2">
        <p className="text-white text-3xl font-bold">Please adopt us</p>
        <p className="text-white text-3xl">We need your help</p>
      </div>
    </div>
  );
}
