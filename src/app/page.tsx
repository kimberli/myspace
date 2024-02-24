import Image from "next/image";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <main className="bg-gradient-to-r from-slate-100 via-emerald-100 to-emerald-200 flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute bottom-24 h-8 w-full">
        <Image
          className="object-cover object-top"
          src="/wall.svg"
          alt="Wall"
          fill={true}
          priority
        />
      </div>
      <div className="absolute bottom-0 h-24 w-full">
        <Image
          className="object-cover object-top"
          src="/floor.svg"
          alt="Floor"
          fill={true}
          priority
        />
      </div>
      <div className="absolute bottom-12 flex flex-row items-end">
        <Image
          src="/couch.svg"
          className="drop-shadow-[24px_24px_20px_rgba(0,0,0,0.8)]"
          alt="Couch"
          width={500}
          height={200}
          priority
        />
        <Image
          src="/plant.svg"
          className="drop-shadow-[24px_24px_20px_rgba(0,0,0,0.8)]"
          alt="Plant"
          width={250}
          height={200}
          priority
        />
      </div>
    </main>
  );
};

export default Home;
