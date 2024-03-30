import { Karla } from "next/font/google";
import React from "react";
import { redirect } from "next/navigation";

const karla = Karla({ subsets: ["latin"] });

const NotFound: React.FC = ({}) => {
  redirect("/");

  return (
    <html lang="en">
      <body className={karla.className}>
        <div className="flex flex-col h-dvh justify-center items-center">
          <h2 className="text-xl">Oops!</h2>
          <p>Page not found</p>
        </div>
      </body>
    </html>
  );
};

export default NotFound;
