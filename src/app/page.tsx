import React from "react";

import Room from "@/components/Room";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <main>
      <Room />
    </main>
  );
};

export default Home;
