import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Select } from "flowbite-react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import stationsStore from "../../../stores/StationsStore";
import StationsTable from "./StationsTable";
import StationsChart from "./StationsChart";
import { useTranslation } from "react-i18next"; // Assuming i18next for localization
import InfDataTable from "./InfDataTable";
import CrossSectionChart from "./CrossSectionChart";
import WaterLevelGauge from "./GaugeChart";

const StationsModal = observer(({ elementId, close, stationName, type }) => {
  console.log("from stationModal");
  const { t } = useTranslation();
  const [waterLevelStation, setWaterLevelStation] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [viewMode, setViewMode] = useState("timeseries");

  const dataStreamType = {
    Sewer: "WaterInner",
    FloodNtc: "WaterInner",
    WaterLevel: "WaterLevel",
    Rain: "Past10Min",
  };

  function timeNow(utcTime) {
    const localDate = new Date(utcTime);
    return localDate.toString() === "Invalid Date"
      ? ""
      : localDate.toLocaleString();
  }

  // chart
  const chartData = useMemo(() => {
    if (!selectedOption || !elementId) {
      return "";
    }
    const data = selectedOption.map((obs) => ({
      time: `
      (${timeNow(obs.obsTimestamp).slice(0, 1).split(",")[0].split(/\//g)[0]}-${
        timeNow(obs.obsTimestamp).slice(2, 4).split(",")[0].split(/\//g)[0]
      })\n
      ${timeNow(obs.obsTimestamp).slice(10, 21)}
      `,
      value: obs.result,
    }));

    return data;
  }, [selectedOption, elementId]);
  //=== chart ===

  async function getStationById(id) {
    try {
      const res = await stationsStore.getStationById(id);
      setWaterLevelStation(res.data.result);
      console.log(res.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async function getLastObservations(elementDataStreamId, hours) {
    const now = new Date();
    const lastHours = new Date(
      now.getTime() - hours * 60 * 60 * 1000
    ).toISOString();

    console.log("now", now.toISOString());
    console.log("lastHours", lastHours);

    try {
      const res = await stationsStore.getLastObservations(
        elementDataStreamId,
        lastHours,
        now.toISOString()
      );
      setSelectedOption(res.data.result);
      console.log("LastObservations data", res.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStationById(elementId);
  }, [elementId]);

  const defaultLastHours = 24;
  useEffect(() => {
    if (waterLevelStation) {
      getLastObservations(
        waterLevelStation?.datastreams?.filter(
          (stream) => stream.name === dataStreamType[type]
        )[0]?.id,
        defaultLastHours
      );
      setViewMode("timeseries");
    }
  }, [waterLevelStation]);

  function displayCityName(city) {
    console.log("city", city);

    if (city === "Unknown" || !city) {
      return "";
    } else {
      return ` - ${city}`;
    }
  }
  return (
    <Modal size="max-w-xl" show={true} onClose={close} className="nav">
      <Modal.Header>
        {t("stationsModal.header", {
          stationName,
          station: waterLevelStation?.name,
        }) + `${displayCityName(waterLevelStation?.city)}`}
      </Modal.Header>
      <Modal.Body className="min-h-[78vh]  overflow-y-auto ">
        {waterLevelStation ? (
          <div className="overflow-y-auto p-4 bg-white rounded-lg">
            <h2 className="text-sm mb-3">
              {t("stationsModal.labels.stationId", {
                id: waterLevelStation?.id,
              })}
            </h2>
            {chartData ? (
              <div className="flex flex-col justify-center md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Select
                    onChange={(e) => {
                      getLastObservations(
                        waterLevelStation?.datastreams?.filter(
                          (stream) => stream.name === dataStreamType[type]
                        )[0]?.id,
                        e.target.value
                      );
                    }}
                    className="w-full"
                  >
                    <option value={24}>
                      {t("stationsModal.selectOptions.twentyFourHours")}
                    </option>
                    <option value={6}>
                      {t("stationsModal.selectOptions.sixHours")}
                    </option>
                    <option value={3}>
                      {t("stationsModal.selectOptions.threeHours")}
                    </option>
                  </Select>

                  {/* table */}
                  <StationsTable type={type} selectedOption={selectedOption} />
                  {/* === table === */}
                </div>

                <div className="w-full md:w-2/3">
                  {/* Gauge Chart Row */}
                  <WaterLevelGauge
                    type={type}
                    currentValue={
                      waterLevelStation.datastreams?.filter(
                        (stream) => stream.name === dataStreamType[type]
                      )[0]?.latestObservation?.lastResult
                    }
                    alertL1={waterLevelStation?.alertL1}
                    alertL2={waterLevelStation?.alertL2}
                    maxValue={
                      Math.max(
                        waterLevelStation?.alertL2 || 0,
                        waterLevelStation?.alertL1 || 0,
                        waterLevelStation.datastreams?.filter(
                          (stream) => stream.name === dataStreamType[type]
                        )[0]?.latestObservation?.lastResult || 0
                      ) * 1.2
                    }
                  />
                  {type === "WaterLevel" &&
                  waterLevelStation?.jsonX &&
                  waterLevelStation?.jsonY ? (
                    <div className="flex items-center justify-end mt-5">
                      <div
                        role="tablist"
                        aria-label="Chart view"
                        className="relative grid grid-cols-2 p-1 bg-slate-100 rounded-full shadow-sm select-none"
                      >
                        <span
                          className={`pointer-events-none absolute inset-y-1 w-1/2 rounded-full bg-white shadow transition-transform duration-300 ease-out ${
                            viewMode === "timeseries"
                              ? "translate-x-0"
                              : "translate-x-full"
                          }`}
                          aria-hidden
                        />
                        <button
                          role="tab"
                          aria-selected={viewMode === "timeseries"}
                          onClick={() => setViewMode("timeseries")}
                          className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-full text-center transition-colors focus:outline-none ${
                            viewMode === "timeseries"
                              ? "text-blue-700"
                              : "text-slate-600 hover:text-slate-800"
                          }`}
                        >
                          Time series
                        </button>
                        <button
                          role="tab"
                          aria-selected={viewMode === "crosssection"}
                          onClick={() => setViewMode("crosssection")}
                          className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-full text-center transition-colors focus:outline-none ${
                            viewMode === "crosssection"
                              ? "text-blue-700"
                              : "text-slate-600 hover:text-slate-800"
                          }`}
                        >
                          River cross-section
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {viewMode === "timeseries" && (
                    <StationsChart
                      chartData={chartData}
                      selectedOption={selectedOption}
                      waterLevelStation={waterLevelStation}
                      type={type}
                      getStationById={getStationById}
                    />
                  )}

                  {type === "WaterLevel" &&
                    viewMode === "crosssection" &&
                    waterLevelStation?.jsonX &&
                    waterLevelStation?.jsonY && (
                      <CrossSectionChart
                        station={waterLevelStation}
                        waterLevelValue={
                          waterLevelStation?.datastreams?.filter(
                            (stream) => stream.name === dataStreamType[type]
                          )[0]?.[0]?.latestObservation?.lastResult ??
                          selectedOption?.[selectedOption?.length - 1]?.result
                        }
                      />
                    )}
                  <div className="station-data block lg:block w-full mt-2">
                    <InfDataTable
                      waterLevelStation={waterLevelStation}
                      selectedOption={selectedOption}
                      type= {type}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Alert color="warning">
                {t("stationsModal.alerts.dataUnavailable")}
              </Alert>
            )}
          </div>
        ) : (
          <div className="min-h-[70vh] flex justify-center items-center">
            <FontAwesomeIcon icon={faSpinner} size="2xl" spin />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
});

export default StationsModal;
