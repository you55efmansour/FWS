import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { observer } from "mobx-react";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import Nav from "../nav/Nav";
import authStore from "../../stores/AuthStore";
import ModalsDisplay from "../modals/modalsDisplay/ModalsDisplay";
import WaterLevelsStations from "./displayStations/waterLevels/WaterLevelsStations";
import FilterLayer from "./displayStations/filterLayer/FilterLayer";
import stationsStore from "../../stores/StationsStore";
import RainStations from "./displayStations/rain/RainStations";
import SewerStations from "./displayStations/sewer/SewerStations";

import StationsSidePanel from "./displayStations/stationsSidePanel/StationsSidePanel";
import FloodNtcStations from "./displayStations/floodNtc/FloodNtcStations";
import CountiesDropDown from "./displayStations/citiesList/CountiesDropDown";

const Home = observer(() => {
  function RemoveDefaultZoom() {
    const map = useMap();
    useEffect(() => {
      map.zoomControl.remove(); // removes the default one
    }, [map]);
    return null;
  }
  console.log("render-home");
  // map position
  const mPosition = [25.03418922, 121.4506683];
  // === map position ==='

  // Refs for station components to access their declustering functions
  const waterLevelsRef = useRef();
  const rainRef = useRef();
  const sewerRef = useRef();
  const floodNtcRef = useRef();

  // Function to decluster a station based on its type
  const declusterStation = (stationType, stationId) => {
    switch (stationType) {
      case "WaterLevel":
        if (waterLevelsRef.current) {
          waterLevelsRef.current.declusterStation(stationId);
        }
        break;
      case "Rain":
        if (rainRef.current) {
          rainRef.current.declusterStation(stationId);
        }
        break;
      case "Sewer":
        if (sewerRef.current) {
          sewerRef.current.declusterStation(stationId);
        }
        break;
      case "FloodNtc":
        if (floodNtcRef.current) {
          floodNtcRef.current.declusterStation(stationId);
        }
        break;
      default:
        break;
    }
  };


  async function getUserPermissions() {
    try {
      const res = await authStore.GetComprehensiveApplicationInfo()
      console.log("userInfo",res.data.result.user.permissions);
      authStore.userPermissions = res.data.result.user.permissions;
    } catch (error) {
      
    }
  }

  useEffect(() => {
    getUserPermissions();
  }, []);

  return (
    <div className="home-page">
      <MapContainer
        attributionControl={false}
        center={mPosition}
        zoom={11}
        style={{ height: "100vh", cursor: "default" }}
      >
        {/* <h1 className="relative nav text-2xl text-center bg-blue-500 bg-opacity-75 w-full">{stationsStore.displayCityName===""?"All Stations" : stationsStore.displayCityName}</h1> */}

        <Nav />
        <FilterLayer />

        <CountiesDropDown />

        <StationsSidePanel declusterStation={declusterStation} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RemoveDefaultZoom />
        <ZoomControl position="bottomleft" />

        {stationsStore.effectiveWaterLevelIsActive &&
          authStore.userPermissions && (
            <WaterLevelsStations ref={waterLevelsRef} />
          )}
        {stationsStore.effectiveRainIsActive && authStore.userPermissions && (
          <RainStations ref={rainRef} />
        )}
        {stationsStore.effectiveSewerIsActive && authStore.userPermissions && (
          <SewerStations ref={sewerRef} />
        )}

        {stationsStore.effectiveFloodNtcIsActive &&
          authStore.userPermissions && <FloodNtcStations ref={floodNtcRef} />}
      </MapContainer>
      {/* display the modal */}
      <ModalsDisplay />
    </div>
  );
});

export default Home;
