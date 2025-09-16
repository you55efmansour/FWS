import React from "react";
import { Table } from "flowbite-react";
import { useTranslation } from "react-i18next";
import {
  formatWarningStatus,
  getWarningStatusColor,
} from "../../../utils/statusFormatter";

export default function InfDataTable({ waterLevelStation, type }) {
  const { t } = useTranslation();

  const dataStreamType = {
    Sewer: "WaterInner",
    FloodNtc: "WaterInner",
    WaterLevel: "WaterLevel",
    Rain: "Past10Min",
  };

  // === time formatter ===
  function timeNow(utcTime) {
    const localDate = new Date(utcTime);
    return localDate.toString() === "Invalid Date"
      ? ""
      : localDate.toLocaleString();
  }

  return (
    <Table striped hoverable>
      <Table.Head>
        <Table.HeadCell colSpan={4} className="text-center">
          {t("infDataTable.header")}
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {/* row1 */}
        <tr>
          {/* col1 */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.state")}
          </th>
          <td className="w-1/4 text-center p-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getWarningStatusColor(
                waterLevelStation.datastreams?.filter(
                  (stream) => stream.name === dataStreamType[type]
                )[0]?.latestObservation?.warningStatus
              )}`}
            >
              {formatWarningStatus(
                waterLevelStation.datastreams?.filter(
                  (stream) => stream.name === dataStreamType[type]
                )[0]?.latestObservation?.warningStatus
              )}
            </span>
          </td>
          {/* col2 */}
           <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.stationNumber")}
          </th>
          <td className="w-1/4 text-center p-4">
            {waterLevelStation?.stationNumber}
          </td>
        </tr>
        {/* row2 */}
        <tr>
          {/* col1 */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.level1Alert")}
          </th>
          <td className="w-1/4 text-center p-4">
            {waterLevelStation?.alertL1?.toFixed(2)}
          </td>
          {/* col2 */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.level2Alert")}
          </th>
          <td className="w-1/4 text-center p-4">
            {waterLevelStation?.alertL2?.toFixed(2)}
          </td>
        </tr>
        {/* row3 */}
        <tr>
          {/* Column 1: Longitude */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.longitude")}
          </th>
          <td className="w-1/4 text-center p-4">
            {waterLevelStation?.longitude}
          </td>
          {/* Column 2: Level 1 Alert */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.latitude")}
          </th>
          <td className="w-1/4 text-center p-4">
            {waterLevelStation?.latitude}
          </td>
          
        </tr>
        {/* row4 */}
        <tr>
          {/* col1 */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.LastValue")}
          </th>
          <td className="w-1/4 text-center p-4 border">
            {
              waterLevelStation.datastreams?.filter(
                (stream) => stream.name === dataStreamType[type]
              )[0]?.latestObservation?.lastResult
            }
          </td>
          {/* col2 */}
          <th
            scope="row"
            className="w-1/4 text-center font-semibold bg-slate-200 p-4"
          >
            {t("infDataTable.columns.time")}
          </th>
          <td className="w-1/4 text-center p-4">
            {timeNow(
              waterLevelStation.datastreams?.filter(
                (stream) => stream.name === dataStreamType[type]
              )[0]?.latestObservation?.lastTimestamp
            )?.slice(0, 10)}
            <br />
            <br />
            {timeNow(
              waterLevelStation.datastreams?.filter(
                (stream) => stream.name === dataStreamType[type]
              )[0]?.latestObservation?.lastTimestamp
            )?.slice(10, 22)}
          </td>
         
        </tr>
      </Table.Body>
    </Table>
  );
}
