import bgImage from "@/assets/anipixels-lfTTzzgwii4-unsplash.jpg";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="h-full">
      <div className="h-[70%] relative flex items-center">
        {/* <Image src={bgImage} fill alt="BgImage" className="object-cover absolute -z-10"  /> */}
        <span>Hello</span>
      </div>
    </div>
  );
}
