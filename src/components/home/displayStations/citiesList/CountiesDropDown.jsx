import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownItem } from "flowbite-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import stationsStore from "../../../../stores/StationsStore";
import { useTranslation } from "react-i18next";
import createModal from "../../../../stores/CreateModal";
import StationsModal from "../../../modals/stationsModals/StationsModal";

const CountiesDropDown = observer(() => {
  const { t } = useTranslation(); // hook for localization

  const [allCounties, setAllCounties] = useState([]);

  async function DisplayAllCounties() {
    try {
      const response = await stationsStore.fetchCountiesWithAreasAndStations(
        "Rain"
      );

      setAllCounties(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  function openStationModal(station) {
    createModal.open(
      <StationsModal
        close={() => createModal.close()}
        elementId={station.stationId}
        stationName={t("rainStations.modal.stationName")}
        type={"Rain"}
        //   lastTime={timeNow(e.lastTimestamp)}
      />
    );
  }

  const displayCounties = () => {
    if (!allCounties) {
      return <DropdownItem disabled>{t("buttonBar.loading")}</DropdownItem>;
    }
    return (
      <div
        className="max-h-[78vh] nav overflow-y-auto w-full"
        onWheel={(e) => e.stopPropagation()}
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        {allCounties.map((city, i) => (
          <Dropdown
            style={{ background: "white", color: "black" }}
            key={i}
            label={city.countyName}
            placement="right"
          >
            <div
              className="max-h-[90vh] nav overflow-y-auto w-full"
              onWheel={(e) => e.stopPropagation()}
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onScroll={(e) => e.stopPropagation()}
            >
              {city.countyAreas.map((area, i) => (
                <Dropdown
                  style={{ background: "white", color: "black" }}
                  key={i}
                  label={area.areaName}
                  placement="right"
                >
                  <div
              className="max-h-[90vh] nav overflow-y-auto w-full"
              onWheel={(e) => e.stopPropagation()}
              onWheelCapture={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onScroll={(e) => e.stopPropagation()}
            >
                  {area.areaStations.map((station, i) => (
                    <DropdownItem
                      key={i}
                      onClick={() => {
                        openStationModal(station);
                      }}
                    >
                      {station.stationName}
                    </DropdownItem>
                  ))}
                  </div>
                </Dropdown>
              ))}
            </div>
          </Dropdown>
        ))}
      </div>
    );
  };
  useEffect(() => {
    DisplayAllCounties();
  }, []);

  return (
    <div
      className="block nav relative left-4 top-20 md:left-10 md:top-10 bg-slate-400 text-black font-bold text-xl rounded w-fit"
    >
      <Dropdown
        renderTrigger={() => (
          <button className="p-2">
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      >
        {displayCounties()}
      </Dropdown>
    </div>
  );
});

export default CountiesDropDown;
