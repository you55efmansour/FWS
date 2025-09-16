import {
  faDroplet,
  faHouseFloodWater,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import React, { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import stationsStore from "../../../../stores/StationsStore";
import { Marker, Tooltip } from "react-leaflet";
import createModal from "../../../../stores/CreateModal";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTranslation } from "react-i18next";
import StationsModal from "../../../modals/stationsModals/StationsModal";
import {
  formatWarningStatus,
  getWarningStatusColor,
} from "../../../../utils/statusFormatter";

const FloodNtcStations = observer(
  forwardRef((props, ref) => {
    const { t } = useTranslation();
    const { allFloodNtcStations } = stationsStore;
    const clusterRef = useRef();

    // Expose declustering function to parent components
    useImperativeHandle(ref, () => ({
      declusterStation: (stationId) => {
        if (clusterRef.current) {
          const cluster = clusterRef.current;
          const station = allFloodNtcStations.find((s) => s.id === stationId);
          if (station && station.latitude && station.longitude) {
            // If we're showing only the selected station, no need to decluster
            if (
              stationsStore.selectedStationType === "FloodNtc" &&
              stationsStore.selectedStationId === stationId
            ) {
              return;
            }

            // Find the marker in the cluster and zoom to show it
            const layer = cluster
              .getLayers()
              .find(
                (layer) =>
                  layer.options && layer.options.stationId === stationId
              );

            if (layer) {
              cluster.zoomToShowLayer(layer, () => {
                // Callback after zooming
              });
            }
          }
        }
      },
    }));

    // Flooding icon

    const iconHtml = renderToStaticMarkup(
      <FontAwesomeIcon
        icon={faHouseFloodWater}
        className="border border-yellow-700 text-yellow-800 bg-yellow-300 rounded-full p-2"
      />
    );

    const faIcon = L.divIcon({
      html: iconHtml,
      className: "fa-icon-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    const selectedIcon = L.divIcon({
      html: renderToStaticMarkup(
        <div className="relative">
          <span className="absolute inset-0 -m-1 rounded-full bg-yellow-400/40 animate-ping"></span>
          <FontAwesomeIcon
            icon={faHouseFloodWater}
            className="relative border-2 border-white ring-8 ring-yellow-500 text-yellow-900 bg-yellow-300 rounded-full p-2 shadow-2xl"
          />
        </div>
      ),
      className: "fa-icon-marker-selected",
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });

    function timeNow(utcTime) {
      const localDate = new Date(utcTime);
      return localDate.toString() === "Invalid Date"
        ? ""
        : localDate.toLocaleString();
    }

    const markers = useMemo(() => {
      if (!allFloodNtcStations) {
        return "";
      }
      console.log(
        "[from flood]",
        stationsStore.selectedStationType,
        stationsStore.selectedStationId,
        !stationsStore.effectiveFloodNtcIsActive
      );

      // If there's a selected station of this type, only show that station
      if (
        stationsStore.selectedStationType === "FloodNtc" &&
        stationsStore.selectedStationId &&
        ((!stationsStore.panelIsOpen && !stationsStore.FloodNtcIsActive) ||
          (stationsStore.panelIsOpen &&
            stationsStore.panelSelectedType !== "FloodNtc"))
      ) {
        const selectedStation = allFloodNtcStations.find(
          (s) => s.id === stationsStore.selectedStationId
        );
        if (selectedStation) {
          return (
            <Marker
              position={[selectedStation.latitude, selectedStation.longitude]}
              icon={selectedIcon}
              zIndexOffset={1000}
              key={selectedStation.id}
              stationId={selectedStation.id}
              eventHandlers={{
                click: () => {
                  createModal.open(
                    <StationsModal
                      close={() => createModal.close()}
                      elementId={selectedStation.id}
                      stationName={t("floodNtcStations.modal.stationName")}
                      type="FloodNtc"
                    />
                  );
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -15]}
                opacity={1}
                className="bg-gray-800 text-white border-0 text-xs"
              >
                <div className="text-center">
                  <div className="font-semibold">{selectedStation.name}</div>
                  <div className="text-gray-300">
                    {selectedStation.category}
                  </div>
                  <div className="text-gray-300">
                    {timeNow(selectedStation.lastTimestamp)}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        }
      }

      // Otherwise, show all stations as normal
      return allFloodNtcStations.map((e) => (
        <Marker
          position={[e.latitude, e.longitude]}
          icon={
            stationsStore.isSelected("FloodNtc", e.id) ? selectedIcon : faIcon
          }
          zIndexOffset={stationsStore.isSelected("FloodNtc", e.id) ? 1000 : 0}
          key={e.id}
          stationId={e.id}
          eventHandlers={{
            click: () => {
              createModal.open(
                <StationsModal
                  close={() => createModal.close()}
                  elementId={e.id}
                  stationName={t("floodNtcStations.modal.stationName")}
                  type="FloodNtc"
                />
              );
            },
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -15]}
            opacity={1}
            permanent={false}
            className="custom-tooltip"
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] max-w-[320px]">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <FontAwesomeIcon
                  icon={faDroplet}
                  className="text-blue-600 text-sm"
                />
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {e.name}
                </h3>
              </div>

              {/* Content Grid */}
              <div className="space-y-2">
                {/* Category */}
                <div className="flex justify-between items-center  bg-gray-100 px-2 py-1 rounded-md">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("floodNtcStations.tooltip.category")}
                  </span>
                  <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                    {e.category}
                  </span>
                </div>

                {/* Status */}
                <div
                  className={`flex justify-between items-center px-2 py-1 rounded-md ${getWarningStatusColor(
                    e.warningStatus
                  )} `}
                >
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("floodNtcStations.tooltip.status")}
                  </span>
                  <div className={`text-sm`}>
                    {formatWarningStatus(e.warningStatus)}
                  </div>
                </div>

                {/* Water Level - Highlighted */}
                <div className="bg-blue-50 rounded-lg p-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      {t("floodNtcStations.tooltip.waterLevel")}
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {e.lastResult}
                    </span>
                  </div>
                </div>

                {/* Last Update Time */}
                <div className="flex justify-between items-start pt-2 border-t border-gray-100  bg-gray-100 px-2 py-1 rounded-md">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <FontAwesomeIcon icon={faStopwatch} className="text-2xl" />
                  </span>
                  <div className="text-right text-xs text-gray-600">
                    {timeNow(e.lastTimestamp) ? timeNow(e.lastTimestamp) : "--"}
                  </div>
                </div>
              </div>
            </div>
          </Tooltip>
        </Marker>
      ));
    }, [allFloodNtcStations, faIcon, selectedIcon, t]);

    // Create icon function that reacts to selection changes
    const iconCreateFunction = useMemo(() => {
      return (cluster) => {
        // Check if this cluster contains the selected station
        const hasSelectedStation =
          cluster.getChildCount() > 0 &&
          cluster
            .getAllChildMarkers()
            .some(
              (marker) =>
                marker.options.stationId === stationsStore.selectedStationId &&
                stationsStore.selectedStationType === "FloodNtc"
            );

        // Check if cluster is expanded by comparing cluster bounds with individual markers
        const isClusterExpanded = (() => {
          if (cluster.getChildCount() <= 1) return false;

          const clusterBounds = cluster.getBounds();

          // If markers are spread out beyond a small threshold, cluster is likely expanded
          const boundsWidth = clusterBounds.getEast() - clusterBounds.getWest();
          const boundsHeight =
            clusterBounds.getNorth() - clusterBounds.getSouth();

          // Threshold: if bounds are larger than ~0.01 degrees, likely expanded
          return boundsWidth > 0.01 || boundsHeight > 0.01;
        })();

        // Use selected station styling if cluster contains selected station
        const bgColor = hasSelectedStation ? "bg-yellow-500" : "bg-yellow-600";
        const borderClass = hasSelectedStation
          ? "border-4 border-yellow-400"
          : "";

        return L.divIcon({
          html: `<div class="relative">
            <div class="${bgColor} ${borderClass} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">${cluster.getChildCount()}</div>
                                      ${
                                        hasSelectedStation && !isClusterExpanded
                                          ? '<span class="absolute inset-0 -m-1 rounded-full bg-yellow-400/40 animate-ping"></span>'
                                          : ""
                                      }
          </div>`,
          className: "custom-cluster-icon",
          iconSize: [40, 40],
        });
      };
    }, []);

    return (
      <MarkerClusterGroup
        ref={clusterRef}
        iconCreateFunction={iconCreateFunction}
        chunkedLoading
        maxClusterRadius={30}
        showCoverageOnHover={false}
        spiderfyOnClick={true}
      >
        {markers}
      </MarkerClusterGroup>
    );
  })
);

export default FloodNtcStations;
