import axios from "axios";
import { PATHS_LOCAL } from "@/constants";

const FETCH_TYPES = {
  CITIES: "FETCH_CITIES",
  DISTRICTS: "FETCH_DISTRICTS",
  WARDS: "FETCH_WARDS",
};

async function fetchLocationOptions(fetchType, locationId) {
  let url;
  switch (fetchType) {
    case FETCH_TYPES.CITIES: {
      url = PATHS_LOCAL.CITIES;
      break;
    }
    case FETCH_TYPES.DISTRICTS: {
      url = `${PATHS_LOCAL.DISTRICTS}/${locationId}.json`;
      break;
    }
    case FETCH_TYPES.WARDS: {
      url = `${PATHS_LOCAL.WARDS}/${locationId}.json`;
      break;
    }
    default: {
      return [];
    }
  }
  const locations = (await axios.get(url)).data["data"];
  return locations.map(({ id, name }) => ({ value: id, label: name }));
}

export async function getLocation(cityCode, districtCode, wardCode) {
  const [cities, districts, wards] = await Promise.all([
    fetchLocationOptions(FETCH_TYPES.CITIES),
    fetchLocationOptions(FETCH_TYPES.DISTRICTS, cityCode ? cityCode : 0),
    fetchLocationOptions(FETCH_TYPES.WARDS, districtCode ? districtCode : 0),
  ]);
  return {
    city: cities.find((e) => e.value === cityCode)?.label,
    district: districts.find((e) => e.value === districtCode)?.label,
    ward: wards.find((e) => e.value === wardCode)?.label,
  };
}


export default getLocation;