import classNames from "classnames";
import React from "react";

interface MusicPlayerProps {
  show: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ show }) => {
  const classes = classNames("z-40", show ? "block" : "hidden");
  return (
    <iframe
      className={classes}
      src="https://open.spotify.com/embed/playlist/3zjYkyOKLv6X9tdFTli9bn?utm_source=generator&theme=0"
      width="100%"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    ></iframe>
  );
};

export default MusicPlayer;
