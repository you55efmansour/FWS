import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownItem } from "flowbite-react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import stationsStore from "../../../../stores/StationsStore";
import { useTranslation } from "react-i18next";

const ButtonBar = observer(() => {
  const { t } = useTranslation(); // hook for localization

  const [allCities, setAllCities] = useState();

  async function DisplayAllCities() {
    try {
      const response = await stationsStore.getAllCities();

      setAllCities(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  const displayCities = () => {
    if (!allCities) {
      return <DropdownItem disabled>{t("buttonBar.loading")}</DropdownItem>;
    }
    return (
      <div className="max-h-[78vh] nav overflow-y-auto w-full">
        {allCities.map((city, i) => (

     
          <DropdownItem
            onClick={() => {
              filterByCity(city);
            }}
            key={i}
          >
            {city}
          </DropdownItem>
        ))}
      </div>
    );
  };

  async function filterByCity(city) {
    const storedLayers = JSON.parse(
      sessionStorage.getItem("checkedLayersValue")
    );
    Object.entries(storedLayers).forEach(([layerType, isChecked]) => {
      if (isChecked) {
        stationsStore.getStationsByType(layerType, city);
        sessionStorage.setItem("storedCityValue", city);
      }
    });
  }

  useEffect(() => {
    DisplayAllCities();
  }, []);

  return (
    <div className="block relative left-4 top-20 md:left-10 md:top-10 nav bg-slate-400 text-black font-bold text-xl rounded w-fit">

      <Dropdown
        renderTrigger={() => (
          <button className="p-2">
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      >

        <DropdownItem onClick={() => filterByCity("")}>
          {t("buttonBar.getAll")}

        </DropdownItem>
        {displayCities()}
      </Dropdown>
    </div>
  );
});

export default ButtonBar;
