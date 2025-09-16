import { observer } from "mobx-react";
import { useEffect, useMemo, useRef, useState } from "react";
import stationsStore from "../../../../stores/StationsStore";
import { Card, Badge, Spinner, TextInput, Select } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import createModal from "../../../../stores/CreateModal";
import StationsModal from "../../../modals/stationsModals/StationsModal";
import L from "leaflet";
import StationsDataTable from "./StationsDataTable";
import { useTranslation } from "react-i18next";

const StationsSidePanel = observer(({ declusterStation }) => {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState(() => {
    if (stationsStore.WaterLevelIsActive) return "WaterLevel";
    if (stationsStore.RainIsActive) return "Rain";
    if (stationsStore.SewerIsActive) return "Sewer";
    if (stationsStore.FloodNtcIsActive) return "FloodNtc";
    return "WaterLevel";
  });
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const AVAILABLE_TYPES = ["WaterLevel", "Rain", "Sewer", "FloodNtc"]; // align with store
  const TYPE_LABELS = {
    WaterLevel: t("stationsSidePanel.types.WaterLevel"),
    Rain: t("stationsSidePanel.types.Rain"),
    Sewer: t("stationsSidePanel.types.Sewer"),
    FloodNtc: t("stationsSidePanel.types.FloodNTC"),
  };

  // Ensure data is loaded for the current type
  useEffect(() => {
    const data = stationsStore.stationsByType[selectedType];
    const storedCity = sessionStorage.getItem("storedCityValue") || "";
    const isLoading = stationsStore.isLoadingByType[selectedType];

    console.log(`[StationsSidePanel] Checking data for ${selectedType}:`, {
      data,
      isLoading,
      hasData: !!data,
      dataLength: data?.length,
      storeError: stationsStore.error,
    });

    // Only load data if we don't have it and we're not already loading
    if (!data && !isLoading) {
      console.log(`Loading data for ${selectedType} with city: ${storedCity}`);
      stationsStore
        .getStationsByType(selectedType, storedCity)
        .then(() => {
          console.log(
            `[StationsSidePanel] Data loading completed for ${selectedType}`
          );
          console.log(
            `[StationsSidePanel] New data:`,
            stationsStore.stationsByType[selectedType]
          );
        })
        .catch((error) => {
          console.error(
            `[StationsSidePanel] Error loading data for ${selectedType}:`,
            error
          );
        });
    } else if (data) {
      console.log(`Data already exists for ${selectedType}, skipping fetch`);
    } else if (isLoading) {
      console.log(`Data is already being loaded for ${selectedType}`);
    }
  }, [selectedType]);

  // Manage panel state in store for priority filtering
  useEffect(() => {
    stationsStore.setPanelOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      stationsStore.setPanelSelectedType(selectedType);
    }
  }, [isOpen, selectedType]);

  // Removed sync logic - panel type selection is now independent of filter layer states

  // Load cities for filter
  useEffect(() => {
    async function loadCities() {
      try {
        const response = await stationsStore.getAllCities();
        setCities(response?.data?.result || []);
      } catch (err) {
        setCities([]);
      }
    }
    loadCities();
  }, []);

  // Handle city change (persist and refetch active layers only)
  const onChangeCity = async (value) => {
    // Only refetch if city actually changed
    if (value === city) {
      console.log(`City unchanged (${value}), skipping refetch`);
      return;
    }

    setCity(value);
    sessionStorage.setItem("storedCityValue", value);
    console.log(
      `City changed to ${value}, refetching data for ${selectedType}`
    );
    await stationsStore.getStationsByType(selectedType, value);
  };

  const isLoading = stationsStore.isLoadingByType[selectedType];
  const currentStationsData = stationsStore.stationsByType[selectedType];

  const filteredItems = useMemo(() => {
    const priority = {
      AboveLevel_1: 0,
      AboveLevel_2: 1,
      AboveLevel_3: 2,
      normal: 3,
      Danger: 0,
      Warning: 1,
      Normal: 3,
      unknown: 4,
      // Alternative formats
      lvl_above_1: 0,
      lvl_above_2: 1,
      lvl_above_3: 2,
      level_above_1: 0,
      level_above_2: 1,
      level_above_3: 2,
      above_level_1: 0,
      above_level_2: 1,
      above_level_3: 2,
    };

    // Get items from store, ensuring we have an array
    const items = stationsStore.stationsByType[selectedType];
    const isLoading = stationsStore.isLoadingByType[selectedType];

    console.log(
      `[StationsSidePanel] selectedType: ${selectedType}, items:`,
      items,
      "isLoading:",
      isLoading,
      "store data keys:",
      Object.keys(stationsStore.stationsByType)
    );

    // If still loading, return empty array to show loading state
    if (isLoading) {
      console.log(`[StationsSidePanel] Still loading data for ${selectedType}`);
      return [];
    }

    // If no data after loading is complete, return empty array
    if (!items) {
      console.log(
        `[StationsSidePanel] No data available for ${selectedType} after loading`
      );
      return [];
    }

    console.log(
      `[StationsSidePanel] Items type:`,
      typeof items,
      "isArray:",
      Array.isArray(items),
      "length:",
      items?.length
    );

    // Convert MobX Proxy to regular array if needed
    let itemsArray = items;
    if (items && typeof items === "object" && items.length !== undefined) {
      // This is likely a MobX Proxy array, convert to regular array
      try {
        itemsArray = Array.from(items);
        console.log(
          `[StationsSidePanel] Converted MobX Proxy to array, length: ${itemsArray.length}`
        );
        console.log(
          `[StationsSidePanel] First few items:`,
          itemsArray.slice(0, 3)
        );
      } catch (error) {
        console.error(
          `[StationsSidePanel] Error converting MobX Proxy:`,
          error
        );
        itemsArray = [];
      }
    }

    // If no data or not an array, return empty array
    if (!itemsArray || !Array.isArray(itemsArray)) {
      console.log(
        `[StationsSidePanel] No valid data for ${selectedType}, returning empty array`
      );
      return [];
    }

    if (!search) {
      console.log(
        `[StationsSidePanel] Returning ${itemsArray.length} items without search filter`
      );
      return itemsArray;
    }
    const q = search.toLowerCase();
    const filtered = itemsArray
      .filter((s) =>
        [s.name, s.category, s.city, s.county, s.area]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          (priority[a.warningStatus] ?? 999) -
          (priority[b.warningStatus] ?? 999)
      );
    console.log(
      `[StationsSidePanel] Filtered ${itemsArray.length} items to ${filtered.length} with search: "${search}"`
    );
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, search, currentStationsData]);

  const openDetails = (id, lastTime) => {
    createModal.open(
      <StationsModal
        close={() => createModal.close()}
        elementId={id}
        stationName={TYPE_LABELS[selectedType]}
        type={selectedType}
      />
    );
  };

  const TypeButton = ({ value }) => (
    <button
      className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-colors shadow ${
        selectedType === value
          ? "bg-sky-500 text-white shadow-sky-800/30"
          : "bg-gray-700/60 text-gray-200 hover:bg-gray-600/70"
      }`}
      onClick={() => {
        setSelectedType(value);
        if (isOpen) {
          stationsStore.setPanelSelectedType(value);
        }
      }}
    >
      {TYPE_LABELS[value]}
    </button>
  );

  const panelRef = useRef(null);
  useEffect(() => {
    if (panelRef.current) {
      try {
        L.DomEvent.disableScrollPropagation(panelRef.current);
        L.DomEvent.disableClickPropagation(panelRef.current);
      } catch (_) {}
    }
  }, []);

  return (
    <div
      ref={panelRef}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="absolute  top-4 left-8 md:top-16 md:left-20 max-h-[85vh] transition-[width] duration-300 ease-in-out"
      style={{
        width: isOpen ? "min(85vw, 1000px)" : "56px",
        interpolateSize: "allow",
        zIndex: "400",
      }}
    >
      <div
        className={`absolute flex justify-center items-center text-white cursor-pointer max-w-[100px] ${
          !isOpen ? "inset-0 nav opacity-1 " : "opacity-0"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
      <Card className="overflow-hidden bg-gray-900/65 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div
            className={
              isOpen
                ? "flex items-center justify-between flex-1 gap-2"
                : "hidden"
            }
          >
            <div
              className={
                isOpen
                  ? "flex gap-2 flex-wrap items-center"
                  : "flex items-center justify-end w-full"
              }
            >
              {isOpen &&
                AVAILABLE_TYPES.map((t) => <TypeButton key={t} value={t} />)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/90 font-semibold text-base md:text-lg">
                {t("stationsSidePanel.labels.stations")}
              </span>
              <Badge color="info" className="bg-sky-600/80 text-white">
                {filteredItems.length}
              </Badge>
            </div>
          </div>
        </div>

        {isOpen && stationsStore.stationsMetaByType[selectedType] && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/90">
            {(() => {
              const meta = stationsStore.stationsMetaByType[selectedType];
              const warn = meta.warningStatusCounts || {};
              const op = meta.operationStatusCounts || {};
              return (
                <>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-2 py-1 rounded bg-green-600/70">
                      {t("stationsSidePanel.status.normal")}:{" "}
                      {warn.normal + warn.aboveLevel_3 ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-yellow-600/70">
                      {t("stationsSidePanel.status.warning")}:{" "}
                      {warn.aboveLevel_2 ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-orange-600/70">
                      {t("stationsSidePanel.status.lv2")}:{" "}
                      {warn.aboveLevel_1 + warn.danger ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-red-600/80">
                      {t("stationsSidePanel.status.lv3")}:{" "}
                      {warn.aboveLevel_4 ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-500/70">
                      {t("stationsSidePanel.status.unknown")}:{" "}
                      {warn.unknown ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <span className="px-2 py-1 rounded bg-sky-600/70">
                      {t("stationsSidePanel.status.active")}: {op.active ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-600/70">
                      {t("stationsSidePanel.status.inactive")}:{" "}
                      {op.inactive ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-purple-600/70">
                      {t("stationsSidePanel.status.maintenance")}:{" "}
                      {op.maintenance ?? 0}
                    </span>
                    <span className="px-2 py-1 rounded bg-red-500/70">
                      {t("stationsSidePanel.status.outOfService")}:{" "}
                      {op.outOfService ?? 0}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {isOpen && (
          <>
            {/* filter section */}
            <div className="mt-3 grid grid-cols-5 gap-2 transition-all">
              <div className="col-span-3">
                <TextInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("stationsSidePanel.labels.searchPlaceholder", {
                    type: TYPE_LABELS[selectedType],
                  })}
                  className="bg-gray-800/80 text-white placeholder-gray-400"
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={city}
                  onChange={(e) => onChangeCity(e.target.value)}
                  className="bg-gray-800/80 text-white"
                >
                  <option value="">
                    {t("stationsSidePanel.labels.allRegions")}
                  </option>
                  {cities?.map((c, idx) => (
                    <option value={c} key={idx}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {/* data table */}
            <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner color="info" />
                </div>
              ) : (
                <div className="md:max-h-[60vh] max-h-[45vh] overflow-auto">
                  <StationsDataTable
                    filteredItems={filteredItems}
                    openDetails={openDetails}
                    selectedType={selectedType}
                    handleTogglePanel={() => setIsOpen((prev) => !prev)}
                    declusterStation={declusterStation}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Card>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseDown={(e) => e.stopPropagation()}
        className={`absolute top-4 ${
          isOpen ? "-right-0 translate-x-full" : "opacity-0"
        } z-[1200] rounded-r-lg bg-gray-900/90 border border-white/20 text-white shadow p-2 hover:bg-gray-800`}
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
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    </div>
  );
});

export default StationsSidePanel;
