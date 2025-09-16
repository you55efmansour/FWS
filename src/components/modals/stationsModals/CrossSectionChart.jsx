import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";

/**
 * CrossSectionChart
 * Renders a river cross-section using jsonX and jsonY arrays and overlays a horizontal
 * water level line. Designed for water level stations only.
 */
export default function CrossSectionChart({ station, waterLevelValue }) {
  const { jsonX, jsonY } = station || {};

  const { data, yDomain, xDomain } = useMemo(() => {
    try {
      const xArr = Array.isArray(jsonX) ? jsonX : JSON.parse(jsonX || "[]");
      const yArr = Array.isArray(jsonY) ? jsonY : JSON.parse(jsonY || "[]");
      const len = Math.min(xArr.length, yArr.length);
      const arr = [];
      for (let i = 0; i < len; i++) {
        const x = Number(xArr[i]);
        const y = Number(yArr[i]);
        if (Number.isFinite(x) && Number.isFinite(y)) {
          arr.push({ x, y });
        }
      }
      // sort by distance so the shape is correct
      arr.sort((a, b) => a.x - b.x);

      const wl = Number.isFinite(waterLevelValue)
        ? Number(waterLevelValue)
        : undefined;
      // values to build stacked areas: bed up to waterline, and water volume segment
      const stacked = arr.map((p) => {
        const bedClamped = wl !== undefined ? Math.min(p.y, wl) : p.y;
        const waterSegment = wl !== undefined ? Math.max(0, wl - p.y) : 0;
        return {
          x: p.x,
          y: p.y,
          bedClamped,
          waterSegment,
        };
      });
      const yValues = arr.map((p) => p.y);
      const minY = Math.min(
        ...yValues,
        Number.isFinite(waterLevelValue) ? waterLevelValue : Infinity
      );
      const maxY = Math.max(
        ...yValues,
        Number.isFinite(waterLevelValue) ? waterLevelValue : -Infinity
      );
      const padding = Math.max(1, (maxY - minY) * 0.1);
      const xs = arr.map((p) => p.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      return {
        data: stacked,
        yDomain: [minY - padding, maxY + padding],
        xDomain: [minX, maxX],
      };
    } catch (e) {
      return { data: [], yDomain: [0, 1], xDomain: [0, 1] };
    }
  }, [jsonX, jsonY, waterLevelValue]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[36vh] flex items-center justify-center text-sm text-gray-500">
        Cross-section data unavailable
      </div>
    );
  }

  return (
    <div className="w-full md:2/3 h-[50vh]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 28 }}
        >
          {/* vertical-only grid to resemble subsections */}
          <CartesianGrid
            vertical={true}
            horizontal={false}
            strokeDasharray="2 6"
          />
          <XAxis
            dataKey="x"
            type="number"
            domain={xDomain}
            tick={{ fontSize: 12 }}
            label={{ value: "Distance", position: "insideBottom", dy: 16 }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            label={{ value: "Elevation", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(val, name) => {
              if (name === "y") return [val, "Elevation"];
              if (name === "bedClamped") return [val, "Riverbed"];
              if (name === "waterSegment") return [val, "Water"];
              return [val, name];
            }}
            labelFormatter={(label) => `Distance: ${label}`}
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) return null;

              const alertInfo = [];

              if (station?.alertL1)
                alertInfo.push(`Danger: ${station.alertL1}`);
              if (station?.alertL2)
                alertInfo.push(`Warning: ${station.alertL2}`);
              if (Number.isFinite(waterLevelValue))
                alertInfo.push(`Current: ${waterLevelValue}`);

              return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                  <p className="font-semibold">Distance: {label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                  {alertInfo.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="font-semibold text-xs">Alert Levels:</p>
                      {alertInfo.map((info, index) => (
                        <p key={index} className="text-xs">
                          {info}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Legend verticalAlign="top" height={24} />

          {/* Stacked areas: bed up to waterline + water volume */}
          <Area
            type="monotone"
            dataKey="bedClamped"
            stackId="bed"
            stroke="#6b7280"
            fill="#d6d3d1"
            name="Riverbed"
            fillOpacity={0.7}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="waterSegment"
            stackId="bed"
            stroke="#2563eb"
            fill="#60a5fa"
            name="Water"
            fillOpacity={0.7}
            isAnimationActive={false}
          />

          {/* bed outline */}
          <Line
            type="monotone"
            dataKey="y"
            stroke="#374151"
            dot={false}
            name="Bed profile"
          />

          {/* Alert level reference lines */}
          {station?.alertL1 && (
            <ReferenceLine
              y={station.alertL1}
              stroke="red"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: "Danger",
                position: "insideTopLeft",
                fill: "red",
                fontSize: 10,
                offset: 5,
              }}
            />
          )}
          {station?.alertL2 && (
            <ReferenceLine
              y={station.alertL2}
              stroke="orange"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: "Warning",
                position: "insideTopLeft",
                fill: "orange",
                fontSize: 10,
                offset: 5,
              }}
            />
          )}

          {/* Current water level */}
          {Number.isFinite(waterLevelValue) && (
            <ReferenceLine
              y={waterLevelValue}
              stroke="#2563eb"
              strokeWidth={3}
              strokeDasharray="6 3"
              label={{
                value: `Current: ${waterLevelValue}`,
                position: "insideTopLeft",
                fill: "#2563eb",
                fontSize: 10,
                fontWeight: "bold",
                offset: 5,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
