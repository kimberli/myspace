import Image from "next/image";

interface HomeProps {}

const MIN_HEIGHT = "700px";
const MIN_WIDTH = "320px";

const Home: React.FC<HomeProps> = () => {
  // We use Tailwind responsive utility classes to adjust element positioning when
  // the screen is too narrow or too short.
  return (
    <main
      className={`bg-gradient-to-r from-primary via-primary-light to-primary-dark flex flex-col items-center justify-between p-24 relative h-screen min-h-[${MIN_HEIGHT}] min-w-[${MIN_WIDTH}] overflow-x-hidden`}
    >
      {/* Wall items consist of the photo array and the bookshelf. */}
      <div className="absolute flex flex-col tall:gap-4 bottom-56 xxs:bottom-72 xs:bottom-80 w-full">
        {/* Photos should be inline on short screens and alternating on tall screens */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-6 w-full px-2">
          <div className="relative right-16 top-64 xs:inset-0 h-[190px] w-[130px]">
            <Image
              src="/photo_a.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo A"
              fill={true}
              priority
            />
          </div>
          <div className="relative right-16 top-60 xs:inset-0 w-[140px] h-[140px]">
            <Image
              src="/photo_b.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo B"
              fill={true}
              priority
            />
          </div>
          <div className="relative left-20 bottom-12 xs:inset-0 w-[140px] h-[180px]">
            <Image
              src="/photo_c.svg"
              className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
              alt="Photo C"
              fill={true}
              priority
            />
          </div>
        </div>
        {/* Bookshelf */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-[300px] xs:w-[320px] h-[150px] xs:h-[160px]">
            <Image
              src="/shelf.svg"
              className="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
              alt="Shelf"
              fill={true}
              priority
            />
          </div>
          {/* Shelf items */}
          <div className="absolute flex flex-row items-end justify-center gap-20 bottom-[3.25rem] w-full">
            <Image
              src="/books.svg"
              className="drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
              alt="Books"
              width={100}
              height={80}
              priority
            />
            <Image src="/bike.svg" alt="Bike" width={80} height={80} priority />
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 xs:bottom-24 bottom-24 h-4 xs:h-8 w-full">
        <Image
          className="object-cover object-top"
          src="/wall.svg"
          alt="Wall"
          fill={true}
          priority
        />
      </div>
      <div className="absolute bottom-0 h-20 xs:h-24 w-full">
        <Image
          className="object-cover object-top"
          src="/floor.svg"
          alt="Floor"
          fill={true}
          priority
        />
      </div>
      <div className="absolute bottom-16 flex flex-row items-center justify-center">
        <div className="relative w-[250px] h-[400px] ml-[625px]">
          <Image
            src="/plant.svg"
            className="drop-shadow-[16px_16px_16px_rgba(0,0,0,0.6)]"
            alt="Plant"
            fill={true}
            object-fit="contain"
            priority
          />
        </div>
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
      {/* Move the side table in front of the couch when the screen is too narrow. */}
      <div className="absolute bottom-6 sm:bottom-14 flex-row">
        <div className="relative w-[120px] h-[130px] xxs:w-[150px] xxs:h-[160px] xs:w-[180px] xs:h-[200px] mr-[250px] sm:mr-[620px]">
          <Image
            src="/table.svg"
            className="drop-shadow-[8px_8px_8px_rgba(0,0,0,0.2)]"
            alt="Table"
            fill={true}
            object-fit="contain"
            priority
          />
        </div>
        <div className="absolute top-10 xxs:top-12 xs:top-[3.75rem] left-14 xxs:left-16 xs:left-20 w-[40px] h-[20px] xxs:w-[50px] xxs:h-[25px] xs:w-[60px] xs:h-[30px]">
          <Image
            src="/paper.svg"
            alt="Paper"
            fill={true}
            object-fit="contain"
            priority
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
