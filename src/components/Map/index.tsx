import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { IoPinSharp } from "react-icons/io5";
import React from "react";

import type { MapLayerMouseEvent } from "react-map-gl";

export type MapClickEvent = MapLayerMouseEvent;

export type Pin = {
  latitude: number;
  longitude: number;
  color?: string;
};

type MapProps = {
  apiKey: string;
  centerLatitude?: number;
  centerLongitude?: number;
  clickable?: boolean;
  onClick?: (e: MapLayerMouseEvent) => void;
  pins?: Pin[];
};

const Map: React.FC<MapProps> = ({
  apiKey,
  centerLatitude,
  centerLongitude,
  clickable,
  onClick,
  pins,
}) => {
  if (!apiKey) {
    return <p>Error: Mapbox API key not set.</p>;
  }

  const markers = (pins || []).map((pin, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={pin.longitude}
      latitude={pin.latitude}
    >
      <IoPinSharp size="2em" color={pin.color} />
    </Marker>
  ));

  return (
    <ReactMapGL
      mapboxAccessToken={apiKey}
      initialViewState={{
        latitude: centerLatitude,
        longitude: centerLongitude,
        zoom: 0,
      }}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        minHeight: "200px",
      }}
      onClick={onClick}
      cursor={clickable ? "pointer" : "auto"}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {markers}
    </ReactMapGL>
  );
};

export default Map;
