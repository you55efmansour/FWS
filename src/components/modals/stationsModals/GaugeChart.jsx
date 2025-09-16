import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function WaterLevelGauge({
  type,
  currentValue,
  alertL1,
  alertL2,
  maxValue = 10,
}) {
  const { t } = useTranslation();
  const chartRef = useRef(null);

  useEffect(() => {
    // Load Google Charts
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.onload = () => {
      window.google.charts.load("current", { packages: ["gauge"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.head.appendChild(script);

    const drawChart = () => {
      if (!window.google || !chartRef.current) return;

      const data = window.google.visualization.arrayToDataTable([
        ["Label", "Value"],
        ["Water Level", currentValue || 0],
      ]);

      // Determine which alert is higher (Alert L1 vs Alert L2)
      const higherAlert = Math.max(alertL1 || 0, alertL2 || 0);
      const lowerAlert = Math.min(alertL1 || 0, alertL2 || 0);

      const options = {
        height: 250,
        redFrom: higherAlert,
        redTo: maxValue,
        yellowFrom: lowerAlert,
        yellowTo: higherAlert,
        greenFrom: 0,
        greenTo: lowerAlert,
        minorTicks: 5,
        majorTicks: [
          "0",
          (maxValue * 0.25).toFixed(1),
          (maxValue * 0.5).toFixed(1),
          (maxValue * 0.75).toFixed(1),
          maxValue.toFixed(1),
        ],
        min: 0,
        max: maxValue,
        animation: {
          duration: 1000,
          easing: "inAndOut",
        },
        // Custom colors to match the image
        greenColor: "#10b981",
        yellowColor: "#f7b519",
        redColor: "#ef4444",
        // Font customization for the label text
        fontSize: 16,
      };

      const chart = new window.google.visualization.Gauge(chartRef.current);
      chart.draw(data, options);

      // Target the specific SVG text element and modify its font-size
      setTimeout(() => {
        const svgText = chartRef.current.querySelector(
          'text[text-anchor="middle"]'
        );
        if (svgText) {
          svgText.setAttribute("font-size", "10"); // Change this value to your desired font size
        }
      }, 100);
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currentValue, alertL1, alertL2, maxValue]);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-600">
          {t("gaugeChart.header", { type })}
        </h3>
      </div>

      <div className="flex justify-center">
        <div ref={chartRef}></div>
      </div>

      {/* Value display */}
      <div className="text-center mt-4">
        <div className="text-2xl font-bold text-gray-800">
          {currentValue?.toFixed(1) || "0.0"}
        </div>
        <div className="text-sm text-gray-500">
          {t("gaugeChart.currentLevel")}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-700">
            {t("gaugeChart.legend.normal", {
              from: 0,
              to: Math.min(alertL1 || 0, alertL2 || 0).toFixed(1),
            })}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#f7b519] rounded-full mr-2"></div>
          <span className="text-gray-700">
            {t("gaugeChart.legend.warning", {
              from: Math.min(alertL1 || 0, alertL2 || 0).toFixed(1),
              to: Math.max(alertL1 || 0, alertL2 || 0).toFixed(1),
            })}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-700">
            {t("gaugeChart.legend.danger", {
              from: Math.max(alertL1 || 0, alertL2 || 0).toFixed(1),
              to: maxValue?.toFixed(1),
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
