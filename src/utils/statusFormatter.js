/**
 * Utility functions to format status values into human-friendly text
 */

/**
 * Formats warning status into human-readable text
 * @param {string} status - The raw warning status value
 * @returns {string} - Human-friendly status text
 */
export const formatWarningStatus = (status) => {
  if (!status) return "-";

  const statusMap = {
    // Standard format
    AboveLevel_1: "Danger",
    AboveLevel_2: "Warning",
    AboveLevel_3: "Normal",
    normal: "Normal",
    Danger: "Danger",
    Warning: "Warning",
    Normal: "Normal",
    unknown: "Unknown",

    // Alternative formats that might exist
    lvl_above_1: "Level 1 Warning",
    lvl_above_2: "Level 2 Warning",
    lvl_above_3: "Normal",
    level_above_1: "Level 1 Warning",
    level_above_2: "Level 2 Warning",
    level_above_3: "Normal",
    above_level_1: "Level 1 Warning",
    above_level_2: "Level 2 Warning",
    above_level_3: "Normal",

    // Add more mappings as needed
  };

  return statusMap[status] || status;
};

/**
 * Gets the appropriate color class for a warning status
 * @param {string} status - The warning status value
 * @returns {string} - Tailwind CSS color class
 */
export const getWarningStatusColor = (status) => {
  if (!status) return "";

  const colorMap = {
    AboveLevel_1: "bg-red-100 text-red-800",
    AboveLevel_2: "bg-yellow-100 text-yellow-800",
    AboveLevel_3: "bg-green-100 text-green-800",
    Normal: "bg-green-100 text-green-800",
    Danger: "bg-red-100 text-red-800",
    Warning: "bg-yellow-100 text-yellow-800",
    unknown: "bg-gray-100 text-gray-800",

    // Alternative formats
    lvl_above_1: "bg-red-100 text-red-800",
    lvl_above_2: "bg-yellow-100 text-yellow-800",
    lvl_above_3: "bg-green-100 text-green-800",
    level_above_1: "bg-red-100 text-red-800",
    level_above_2: "bg-yellow-100 text-yellow-800",
    level_above_3: "bg-green-100 text-green-800",
    above_level_1: "bg-red-100 text-red-800",
    above_level_2: "bg-yellow-100 text-yellow-800",
    above_level_3: "bg-green-100 text-green-800",
  };

  return colorMap[status] || "";
};
