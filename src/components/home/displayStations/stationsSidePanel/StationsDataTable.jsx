import React from "react";
import { Table, Button } from "flowbite-react";
import { useMap } from "react-leaflet";
import stationsStore from "../../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import {
  formatWarningStatus,
  getWarningStatusColor,
} from "../../../../utils/statusFormatter";
import {
  getTableConfig,
  getTableMinWidth,
} from "../../../../utils/tableConfig";

export default function StationsDataTable({
  filteredItems,
  openDetails,
  selectedType,
  handleTogglePanel,
  declusterStation,
}) {
  const { t } = useTranslation();
  const map = useMap();

  // Get table configuration based on station type
  const tableConfig = getTableConfig(selectedType , t);
  const minWidth = getTableMinWidth(tableConfig.columns);

  const getRowClass = (status) => {
    switch (status) {
      case "AboveLevel_1":
      case "lvl_above_1":
      case "level_above_1":
      case "above_level_1":
      case "Danger":
        return "even:bg-gray-300 odd:bg-gray-300";
      case "AboveLevel_2":
      case "lvl_above_2":
      case "level_above_2":
      case "above_level_2":
        return "even:bg-gray-200 odd:bg-gray-200";
      case "AboveLevel_3":
      case "lvl_above_3":
      case "level_above_3":
      case "above_level_3":
        return "even:bg-gray-100 odd:bg-gray-100";
      default:
        return "even:bg-white odd:bg-white";
    }
  };

  function timeNow(utcTime) {
    const localDate = new Date(utcTime);
    return localDate.toString() === "Invalid Date"
      ? ""
      : localDate.toLocaleString();
  }

  return (
    <Table
      striped
      theme={{
        root: {
          base: `w-full ${minWidth} text-left text-[0.95rem] text-gray-200`,
        },
      }}
    >
      <Table.Head className="text-xs">
        {tableConfig.columns.map((column, index) => (
          <Table.HeadCell
            key={column.key}
            className={`bg-gray-800/90 backdrop-blur sticky top-0 z-10 text-gray-100 ${
              column.width
            } ${index === tableConfig.columns.length - 1 ? "text-right" : ""}`}
          >
            {column.header}
          </Table.HeadCell>
        ))}
        <Table.HeadCell className="bg-gray-800/90 backdrop-blur sticky top-0 z-10 text-gray-100 text-right w-20">
          {t("table.details")}
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-white/10 text-xs">
        {filteredItems.map((s) => (
          <Table.Row
            key={s.id}
            className={`${getRowClass(
              s.warningStatus
            )} cursor-pointer text-black`}
            onClick={() => {
              stationsStore.clearSelectedStation();

              handleTogglePanel();
              stationsStore.setSelectedStation(selectedType, s.id);
              if (s.latitude && s.longitude) {
                map.flyTo([s.latitude, s.longitude], 15, { duration: 0.8 });

                // Decluster the station if it's in a cluster
                if (declusterStation) {
                  declusterStation(selectedType, s.id);
                }
              }
            }}
          >
            {tableConfig.columns.map((column) => (
              <Table.Cell key={column.key} className={column.cellClass}>
                {column.render(
                  s[column.key],
                  s,
                  timeNow,
                  formatWarningStatus,
                  getWarningStatusColor
                )}
              </Table.Cell>
            ))}
            <Table.Cell className="text-right w-20 px-2">
              <Button
                size="xs"
                color="light"
                onClick={(e) => {
                  e.stopPropagation();
                  openDetails(s.id, timeNow(s.lastTimestamp));
                }}
              >
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCircleInfo} className="me-1" />
                  {t("table.info")}
                </span>
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
        {filteredItems.length === 0 && (
          <Table.Row>
            <Table.Cell
              colSpan={tableConfig.columns.length + 1}
              className="text-center text-gray-400"
            >
              {t("stationsDataTable.messages.noStations")}
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
