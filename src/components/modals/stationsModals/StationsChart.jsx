import React, { useMemo } from 'react';
import authStore from '../../../stores/AuthStore';
import { Button } from 'flowbite-react';
import createModal from '../../../stores/CreateModal';
import EditStationModal from './EditStationModal';
import VerifyAction from "../../verifyAction/VerifyAction";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import stationsStore from '../../../stores/StationsStore';
import { useTranslation } from 'react-i18next'; // Assuming i18next for localization

export default function StationsChart({ chartData, selectedOption, waterLevelStation, type , getStationById }) {
  const { t } = useTranslation(); // Hook to access translations

  const minY = () => {
    const results = selectedOption?.map((e) => e.result) || [];
    const minNumb = results.length > 0 ? Math.min(...results) - 5 : waterLevelStation.alertL3??0 - 5;
    return Math.floor(minNumb);
  };

  const maxY = () => {   
    const maxNumb = waterLevelStation.alertL1 + 5;
    return Math.floor(maxNumb);
  };

  const indexedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      // fallback dummy data just to render axes & threshold lines
      return [{ time: "", value: 0, index: 0 }];
    }
    return chartData.reverse().map((item, index) => ({ ...item, index }));
  }, [chartData]);

  return (<>
      {authStore.userPermissions.includes("Stations.Update") && (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              createModal.open(
                <EditStationModal
                  close={() => createModal.close()}
                  element={waterLevelStation}
                  type={type}
                  getStationById={getStationById}
                />
              )
            }
            className="my-3 modal-btn"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button
            onClick={() =>
              createModal.open(
                <VerifyAction
                  close={() => createModal.close()}
                  action={"delete"}
                  actionFunc={(id) => stationsStore.deleteStation(id)}
                  id={waterLevelStation.id}
                  token={authStore.token}
                  afterActionFunc={(type) => stationsStore.getStationsByType(type)}
                  type={type}
                />
              )
            }
            className="my-3 modal-btn bg-red-600 delete-btn"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
    <div className='h-[50vh] overflow-y-auto'>
      <ResponsiveContainer
        className="overflow-hidden outline-none focus:outline-none border-0 focus:border-0"
        width="100%"
        height="100%"
      >
        <LineChart data={indexedChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide={true} />
          <XAxis
            // reversed={true}
            dataKey="index"
            tick={({ x, y, payload }) => {
    const timeLabel = indexedChartData[payload.value]?.time || "";
    const lines = timeLabel.toString().split("\n"); // safe split

    return (
      <text x={x} y={y-4} textAnchor="middle" fill="#666">
        {lines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : 15}>
            {line}
          </tspan>
        ))}
      </text>
    );
  }}
            ticks={[
              0,
              Math.floor(indexedChartData.length / 2),
              indexedChartData.length - 1,
            ]}
            tickFormatter={(index) => indexedChartData[index].time}
          />
          <YAxis domain={[minY, maxY]} />
          <Tooltip
            labelFormatter={(index) => (
            <span style={{ whiteSpace: "pre-line" }}>
              {indexedChartData[index].time}
            </span>
  )}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#007bff"
            strokeWidth={2}
            dot={false}
          />

          {/* threshold lines */}
          <ReferenceLine
            y={waterLevelStation.alertL1}
            label={{
              value: t("stationsChart.referenceLines.danger"),
              position: "insideBottom",
              fill: "red",
            }}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={waterLevelStation.alertL2}
            label={{
              value: t("stationsChart.referenceLines.warning"),
              position: "insideBottom",
              fill: "orange",
            }}
            stroke="orange"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            y={waterLevelStation.alertL3}
            label={{
              value: t("stationsChart.referenceLines.safe"),
              position: "insideBottom",
              fill: "green",
            }}
            stroke="green"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </>

  );
}