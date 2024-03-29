import RoomItem from "@/components/RoomItem";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  // We use Tailwind responsive utility classes to adjust element positioning when
  // the screen is too narrow or too wide.
  // Keep in mind that responsive classes are mobile-first; "xs" means at a width of xs or higher.
  return (
    <main
      className={`bg-gradient-to-r from-primary via-primary-light to-primary-dark flex flex-col items-center justify-between p-24 relative h-dvh min-h-[650px] overflow-x-hidden`}
    >
      {/* Wall items consist of the photo array and the bookshelf. */}
      <div className="absolute flex flex-col bottom-56 xs:bottom-72 w-full">
        {/* Photos should be inline on wide screens and alternating on narrow screens */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-6 w-full px-2">
          <RoomItem
            src="/photo_a.svg"
            className="relative right-16 top-48 xs:inset-0 h-[150px] w-[100px] xs:h-[180px] xs:w-[120px]"
            imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          />
          <RoomItem
            src="/photo_b.svg"
            className="relative right-16 top-48 xs:inset-0 w-[90px] h-[90px] xs:w-[140px] xs:h-[140px]"
            imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          />
          <RoomItem
            src="/photo_c.svg"
            className="relative left-16 bottom-12 xs:inset-0 w-[112px] h-[144px] xs:w-[140px] xs:h-[180px]"
            imageClass="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
          />
        </div>
        {/* Bookshelf */}
        <div className="flex flex-col items-center justify-center w-full">
          <RoomItem
            src="/shelf.svg"
            className="relative w-[300px] xs:w-[320px] h-[150px] xs:h-[160px]"
            imageClass="drop-shadow-[8px_8px_4px_rgba(0,0,0,0.2)]"
          />
          {/* Shelf items */}
          <div className="absolute flex flex-row items-end justify-center gap-20 bottom-[3.25rem]">
            <RoomItem
              src="/books.svg"
              className="relative w-[100px] h-[70px]"
              imageClass="drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
            />
            <RoomItem src="/bike.svg" className="relative w-[80px] h-[60px]" />
          </div>
        </div>
      </div>
      <RoomItem
        src="/wall.svg"
        className="absolute bottom-20 xs:bottom-24 h-4 xs:h-8 w-full"
        imageClass="object-cover object-top"
      />
      <RoomItem
        src="/floor.svg"
        className="absolute bottom-0 h-20 xs:h-24 w-full"
        imageClass="object-cover object-top"
      />
      <div className="absolute bottom-16 flex flex-row items-center justify-center">
        <RoomItem
          src="/plant.svg"
          className="relative w-[200px] h-[320px] xs:w-[250px] xs:h-[400px] ml-[450px] xs:ml-[625px]"
          imageClass="drop-shadow-[16px_16px_16px_rgba(0,0,0,0.6)]"
        />
      </div>
      <div className="absolute bottom-12 flex flex-row justify-center">
        <RoomItem
          src="/couch.svg"
          className="relative w-[400px] h-[160px] xs:w-[500px] xs:h-[200px]"
          imageClass="drop-shadow-[24px_24px_20px_rgba(0,0,0,0.8)]"
        />
      </div>
      {/* Move the side table in front of the couch when the screen is too narrow. */}
      <div className="absolute bottom-6 xs:bottom-4 md:bottom-14 flex-row">
        <RoomItem
          src="/table.svg"
          className="relative w-[150px] h-[160px] xs:w-[180px] xs:h-[200px] mr-[200px] xs:mr-[300px] md:mr-[620px]"
          imageClass="drop-shadow-[8px_8px_8px_rgba(0,0,0,0.2)]"
        />
        <RoomItem
          src="/paper.svg"
          className="absolute top-12 xs:top-[3.75rem] left-16 xs:left-20 w-[50px] h-[25px] xs:w-[60px] xs:h-[30px]"
        />
      </div>
    </main>
  );
};

export default Home;
