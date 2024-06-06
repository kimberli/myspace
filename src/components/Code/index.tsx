import classNames from "classnames";
import React from "react";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

interface CodeProps extends React.PropsWithChildren {
  className?: string;
}

const Code: React.FC<CodeProps> = ({ className, children }: CodeProps) => {
  return (
    <pre className={classNames("font-mono", className, robotoMono.className)}>
      {children}
    </pre>
  );
};

export default Code;
