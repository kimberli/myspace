import Image from "next/image";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <main className="bg-gradient-to-r from-primary via-primary-light to-primary-dark flex min-h-screen flex-col items-center justify-between p-24">
      {/* Wall items consist of the photo array and the bookshelf. */}
      <div className="absolute flex flex-col gap-6 tall:gap-12 bottom-80 w-full">
        {/* Photos should be inline on short screens and alternating on tall screens */}
        <div className="flex flex-row items-center justify-center gap-10 tall:gap-6 w-full">
          <div className="relative w-[80px] tall:w-[130px] h-[110px] tall:h-[190px]">
            <Image
              src="/photo_a.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo A"
              layout="fill"
              object-fit="contain"
              priority
            />
          </div>
          <div className="relative w-[85px] tall:w-[140px] h-[85px] tall:h-[140px]">
            <Image
              src="/photo_b.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo B"
              layout="fill"
              object-fit="contain"
              priority
            />
          </div>
          <div className="relative w-[80px] tall:w-[140px] h-[120px] tall:h-[180px]">
            <Image
              src="/photo_c.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo C"
              layout="fill"
              object-fit="contain"
              priority
            />
          </div>
        </div>
        {/* Bookshelf */}
        <div className="flex flex-row items-center justify-center w-full">
          <Image
            src="/shelf.svg"
            className="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
            alt="Shelf"
            width={400}
            height={160}
            priority
          />
        </div>
        {/* Bike */}
        <div className="absolute flex flex-row items-center justify-center gap-6 bottom-[2rem] w-full">
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
      <div className="absolute bottom-14 hidden sm:flex flex-row items-end">
        <Image
          src="/flowers.svg"
          className="drop-shadow-[8px_8px_8px_rgba(0,0,0,0.2)]"
          alt="Flowers"
          width={180}
          height={200}
          priority
        />
        <span className="sm:w-[600px] md:w-[700px]" />
      </div>
      <div className="absolute bottom-16 flex flex-row items-end justify-end">
        <span className="sm:w-[600px] md:w-[700px]" />
        <Image
          src="/plant.svg"
          className="drop-shadow-[16px_16px_16px_rgba(0,0,0,0.6)]"
          alt="Plant"
          width={250}
          height={200}
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
    </main>
  );
};

export default Home;
