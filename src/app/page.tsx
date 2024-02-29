import Image from "next/image";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <main className="bg-gradient-to-r from-primary via-primary-light to-primary-dark flex min-h-screen flex-col items-center justify-between p-24">
      <div className="absolute flex flex-row items-center justify-center gap-6 top-16 h-48 w-full">
        <Image
          src="/photo_a.svg"
          className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          alt="Photo A"
          width={120}
          height={80}
          priority
        />
        <Image
          src="/photo_b.svg"
          className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          alt="Photo B"
          width={130}
          height={130}
          priority
        />
        <Image
          src="/photo_c.svg"
          className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          alt="Photo C"
          width={130}
          height={160}
          priority
        />
      </div>
      <div className="absolute flex flex-row items-center justify-center top-44 w-full">
        <Image
          src="/shelf.svg"
          className="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
          alt="Shelf"
          width={400}
          height={160}
          priority
        />
      </div>
      <div className="absolute flex flex-row items-center justify-center gap-6 top-72 w-full">
        <span className="w-[120px]" />
        <Image
          src="/bike.svg"
          className="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
          alt="Bike"
          width={100}
          height={80}
          priority
        />
      </div>
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
      <div className="absolute bottom-12 flex flex-row justify-center">
        <Image
          src="/couch.svg"
          className="drop-shadow-[24px_24px_20px_rgba(0,0,0,0.8)]"
          alt="Couch"
          width={500}
          height={200}
          priority
        />
      </div>
      <div className="absolute bottom-14 flex flex-row items-end">
        <Image
          src="/flowers.svg"
          className="drop-shadow-[8px_8px_8px_rgba(0,0,0,0.2)]"
          alt="Flowers"
          width={180}
          height={200}
          priority
        />
        <span className="w-[700px]" />
      </div>
      <div className="absolute bottom-16 flex flex-row items-end">
        <span className="w-[700px]" />
        <Image
          src="/plant.svg"
          className="drop-shadow-[16px_16px_16px_rgba(0,0,0,0.6)]"
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
