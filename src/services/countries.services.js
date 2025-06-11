import axios from "axios"
import * as countriesApi from "../api/countries.api"


const getCountries = async () => {
  const response = await axios.get(countriesApi.getCountries())
  return response.data
}

export { getCountries }