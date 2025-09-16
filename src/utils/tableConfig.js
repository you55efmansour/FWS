/**
 * Table configuration for different station types with localization support
 */

export const TABLE_CONFIGS = {
  WaterLevel: (t) => ({
    columns: [
      {
        key: "name",
        header: t("table.name"),
        width: "w-32",
        cellClass: "font-medium whitespace-nowrap px-3",
        render: (value) => value || "-",
      },
      {
        key: "category",
        header: t("table.category"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => value || "-",
      },
      {
        key: "city",
        header: t("table.city"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value, item) => item.city || item.county || "-",
      },
      {
        key: "lastResult",
        header: t("table.lastResult"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => value ?? "-",
      },
      {
        key: "lastTimestamp",
        header: t("table.lastTime"),
        width: "w-32",
        cellClass: "w-32 whitespace-nowrap px-2",
        render: (value, item, timeNow) => {
          if (!value) return "-";
          const timeStr = timeNow(value);
          return (
            <>
              {timeStr.slice(0, 11) ?? "-"}
              <br />
              {timeStr?.slice(11, 21) ?? "-"}
            </>
          );
        },
      },
      {
        key: "alertL1",
        header: t("table.warnLv1"),
        width: "w-20",
        cellClass: "w-20 text-center px-2",
        render: (value) => value ?? "-",
      },
      {
        key: "alertL2",
        header: t("table.warnLv2"),
        width: "w-20",
        cellClass: "w-20 text-center px-2",
        render: (value) => value ?? "-",
      },
      {
        key: "alertL3",
        header: t("table.warnLv3"),
        width: "w-20",
        cellClass: "w-20 text-center px-2",
        render: (value) => value ?? "-",
      },
      {
        key: "warningStatus",
        header: t("table.status"),
        width: "w-40",
        cellClass: "w-40 px-2",
        render: (
          value,
          item,
          timeNow,
          formatWarningStatus,
          getWarningStatusColor
        ) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getWarningStatusColor(
              value
            )}`}
          >
            {formatWarningStatus(value)}
          </span>
        ),
      },
    ],
  }),
  // Repeat for Rain, Sewer, FloodNtc...
  Rain: (t) => ({
    columns: [
      {
        key: "name",
        header: t("table.name"),
        width: "w-32",
        cellClass: "font-medium whitespace-nowrap px-3",
        render: (value) => value || "-",
      },
      {
        key: "category",
        header: t("table.category"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => value || "-",
      },
      {
        key: "county",
        header: t("table.county"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => value || "-",
      },
      {
        key: "area",
        header: t("table.area"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => value || "-",
      },
      {
        key: "lastResult",
        header: t("table.lastResult"),
        width: "w-24",
        cellClass: "w-24 text-center px-2",
        render: (value) => `${value} mm`,
      },
      {
        key: "lastTimestamp",
        header: t("table.lastTime"),
        width: "w-32",
        cellClass: "w-32 whitespace-nowrap px-2",
        render: (value, item, timeNow) => {
          const timeStr = timeNow(value);
          return (
            <>
              {timeStr.slice(0, 11) ?? "-"}
              <br />
              {timeStr?.slice(11, 21) ?? "-"}
            </>
          );
        },
      },
      {
        key: "alertL2",
        header: t("table.alertH1"),
        width: "w-20",
        cellClass: "w-20 text-center px-2",
        render: (value) => value,
      },
      {
        key: "alertL1",
        header: t("table.floodH1"),
        width: "w-20",
        cellClass: "w-20 text-center px-2",
        render: (value) => value,
      },
      {
        key: "warningStatus",
        header: t("table.status"),
        width: "w-40",
        cellClass: "w-40 px-2",
        render: (
          value,
          item,
          timeNow,
          formatWarningStatus,
          getWarningStatusColor
        ) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getWarningStatusColor(
              value
            )}`}
          >
            {formatWarningStatus(value)}
          </span>
        ),
      },
    ],
  }),
  // Repeat for Sewer and FloodNtc, using t('table.key') for headers
  // ...
};

/**
 * Get table configuration for a specific station type
 * @param {string} stationType - The type of station
 * @param {function} t - The translation function
 * @returns {Object} Table configuration
 */
export const getTableConfig = (stationType, t) => {
  const configFactory = TABLE_CONFIGS[stationType] || TABLE_CONFIGS.WaterLevel;
  return configFactory(t);
};

/**
 * Calculate total table width based on column widths
 * @param {Array} columns - Array of column configurations
 * @returns {string} Minimum width class
 */
export const getTableMinWidth = (columns) => {
  const totalWidth = columns.reduce((acc, col) => {
    const width = col.width;
    if (width === "w-20") return acc + 80;
    if (width === "w-24") return acc + 96;
    if (width === "w-32") return acc + 128;
    if (width === "w-40") return acc + 160;
    return acc + 100; // default width
  }, 0);

  // Add some padding and convert to Tailwind class
  if (totalWidth <= 800) return "min-w-[800px]";
  if (totalWidth <= 900) return "min-w-[900px]";
  if (totalWidth <= 1000) return "min-w-[1000px]";
  return "min-w-[1100px]";
};
