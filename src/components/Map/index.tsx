import "mapbox-gl/dist/mapbox-gl.css";

import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { IoPinSharp } from "react-icons/io5";

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
  zoomLevel?: number;
  clickable?: boolean;
  onClick?: (e: MapLayerMouseEvent) => void;
  pins?: Pin[];
};

const Map: React.FC<MapProps> = ({
  apiKey,
  centerLatitude,
  centerLongitude,
  zoomLevel,
  clickable,
  onClick,
  pins,
}) => {
  const [latitude, setLatitude] = useState<number>(centerLatitude || 0);
  const [longitude, setLongitude] = useState<number>(centerLongitude || 0);
  const [zoom, setZoom] = useState<number>(zoomLevel || 0);

  useEffect(() => {
    if (typeof centerLatitude !== "undefined") {
      setLatitude(centerLatitude);
    }
    if (typeof centerLongitude !== "undefined") {
      setLongitude(centerLongitude);
    }
  }, [centerLatitude, centerLongitude]);

  useEffect(() => {
    if (typeof zoomLevel !== "undefined") {
      setZoom(zoomLevel);
    }
  }, [zoomLevel]);

  if (!apiKey) {
    return <p>Error: Mapbox API key not set.</p>;
  }

  const setViewState = (viewState: object): void => {
    setLatitude(viewState.latitude);
    setLongitude(viewState.longitude);
    setZoom(viewState.zoom);
  };

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
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        minHeight: "200px",
      }}
      onMove={({ viewState }) => setViewState(viewState)}
      onClick={onClick}
      cursor={clickable ? "pointer" : "auto"}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      latitude={latitude}
      longitude={longitude}
      zoom={zoom}
    >
      {markers}
    </ReactMapGL>
  );
};

export default Map;
