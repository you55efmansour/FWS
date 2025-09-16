import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faExclamationTriangle, 
  faHome} from "@fortawesome/free-solid-svg-icons";

function RoleError() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              className="text-6xl text-red-600 dark:text-red-400"
            />
          </div>
        </div>


        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          {/* Main Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {t("roleError.message") || "You don't have permission to access this page"}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Back to Home Button */}
          <button
            onClick={() => (window.document.location = "/home")}
            className="group flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[200px]"
          >
            <FontAwesomeIcon 
              icon={faHome} 
              className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300"
            />
            {t("roleError.backHome") || "Back to Home"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleError;
