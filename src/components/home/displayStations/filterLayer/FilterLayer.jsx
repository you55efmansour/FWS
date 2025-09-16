import { useEffect, useState, useMemo } from "react";
import { Tabs, Checkbox, Card } from "flowbite-react";
import { observer } from "mobx-react";
import stationsStore from "../../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const FilterLayer = observer(() => {
  const { t } = useTranslation();
  console.log("from FilterLayer");

  let checkedLayersValue = {
    WaterLevel: true,
    Sewer: false,
    Rain: false,
    FloodNtc: false,
  };

  const storedCityValue = sessionStorage.getItem("storedCityValue");

  if (sessionStorage.getItem("checkedLayersValue")) {
    checkedLayersValue = JSON.parse(
      sessionStorage.getItem("checkedLayersValue")
    );
  }
  const [checkedLayers, setCheckedLayers] = useState(checkedLayersValue);
  const [activeTab, setActiveTab] = useState("base");
  const [isOpen, setIsOpen] = useState(true);
  const storedCity = storedCityValue ? storedCityValue : "";

  async function getStationsByType(type, city) {
    await stationsStore.getStationsByType(type, city);
  }

  const layers = [
    {
      label: t("filterLayer.layers.waterLevel"),
      value: "WaterLevel",
    },
    {
      label: t("filterLayer.layers.sewer"),
      value: "Sewer",
    },
    {
      label: t("filterLayer.layers.rain"),
      value: "Rain",
    },
    {
      label: t("filterLayer.layers.floodNtc"),
      value: "FloodNtc",
    },
  ];

  // Configuration object mapping layer types to their toggle methods and active state getters
  const layerConfig = useMemo(
    () => ({
      WaterLevel: {
        toggle: () => stationsStore.togglingWaterLevel(),
        isActive: () => stationsStore.WaterLevelIsActive,
      },
      Sewer: {
        toggle: () => stationsStore.togglingSewer(),
        isActive: () => stationsStore.SewerIsActive,
      },
      Rain: {
        toggle: () => stationsStore.togglingRain(),
        isActive: () => stationsStore.RainIsActive,
      },
      FloodNtc: {
        toggle: () => stationsStore.togglingFloodNtc(),
        isActive: () => stationsStore.FloodNtcIsActive,
      },
    }),
    []
  );

  const toggleLayer = (value) => {
    const newCheckedState = !checkedLayers[value];

    setCheckedLayers((prev) => ({
      ...prev,
      [value]: newCheckedState,
    }));

    // Always update the store state to keep it in sync
    const config = layerConfig[value];
    if (config) {
      config.toggle();

      // If layer is being turned on, fetch stations
      if (newCheckedState) {
        getStationsByType(value, storedCity);
      }
    }
  };

  useEffect(() => {
    sessionStorage.setItem("checkedLayersValue", JSON.stringify(checkedLayers));
  }, [checkedLayers]);

  useEffect(() => {
    // Sync stored layer states with store states when city changes
    if (sessionStorage.getItem("checkedLayersValue")) {
      const storedLayers = JSON.parse(
        sessionStorage.getItem("checkedLayersValue")
      );

      Object.entries(storedLayers).forEach(([layerType, isChecked]) => {
        const config = layerConfig[layerType];
        if (!config) return;

        if (isChecked) {
          getStationsByType(layerType, storedCity);
          // If layer should be active but isn't, toggle it
          if (!config.isActive()) {
            config.toggle();
          }
        } else {
          // If layer should be inactive but is active, toggle it
          if (config.isActive()) {
            config.toggle();
          }
        }
      });
    }
  }, [storedCity, layerConfig]);

  return (
    <Card
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="absolute  top-16 right-8 md:top-16 md:right-20 bg-gray-800 bg-opacity-70 text-white w-80 z-50 transition-[width] duration-300 ease-in-out"
      style={{
        width: isOpen ? "min(16rem, 5000px)" : "56px",
        interpolateSize: "allow",
        zIndex: "400",
      }}
    >
      {/* Header with Collapse Toggle */}
      <div
        className={`absolute flex justify-center items-center text-white cursor-pointer max-w-[100px] ${
          !isOpen ? "inset-0 nav opacity-1 " : "opacity-0"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>

      {isOpen && (
        <>
          {/* Tabs */}
          <Tabs
            aria-label="Layer tabs"
            onActiveTabChange={(tabIndex) =>
              setActiveTab(tabIndex === 0 ? "base" : "forecast")
            }
            theme={{
              tablist: {
                tabitem: {
                  base: "flex items-center justify-center rounded-lg p-2 text-sm font-medium",
                },
              },
            }}
          >
            <Tabs.Item active title={t("filterLayer.tabs.base")} />
            <Tabs.Item title={t("filterLayer.tabs.forecast")} />
          </Tabs>

          {/* Base Tab */}
          {activeTab === "base" && (
            <div className="text-sm">
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {layers.map((layer, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      checkedLayers[layer.value] && "text-green-500"
                    } `}
                  >
                    <Checkbox
                      className="cursor-pointer"
                      id={`layer-${index}`}
                      checked={checkedLayers[layer.value]}
                      onChange={() => toggleLayer(layer.value)}
                    />
                    <label
                      htmlFor={`layer-${index}`}
                      className="capitalize cursor-pointer"
                    >
                      {layer.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === "forecast" && (
            <div className="mt-4 text-gray-400 text-sm">
              {t("filterLayer.forecastEmpty")}
            </div>
          )}
        </>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute top-4 ${
          isOpen ? "-left-[50px] translate-x-full" : "opacity-0"
        } z-[1200] rounded-l-lg bg-gray-900/90 border border-white/20 text-white shadow p-2 hover:bg-gray-800`}
        aria-label={
          isOpen
            ? t("stationsSidePanel.labels.collapsePanel")
            : t("stationsSidePanel.labels.openPanel")
        }
        title={
          isOpen
            ? t("stationsSidePanel.labels.collapse")
            : t("stationsSidePanel.labels.stationsTitle")
        }
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </Card>
  );
});

export default FilterLayer;
