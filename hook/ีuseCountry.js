import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useCountry() {
  const [countries, setCountries] = useState([]);
  const [load, setLoad] = useState(false);
  const [countryOptions, setCountryOPtions] = useState([]);

  const fetchCountry = async () => {
    setLoad(true);
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all?fields=name");
      setCountries(res?.data);
      const options = res.data.map((c) => ({
        label:c.name.common,
        value:c.name.common
      }))
      setCountryOPtions(options);
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  return {
    countries,
    load,
    countryOptions,
  };
}
