import { alerts } from "@/libs/alerts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useUniversity() {
  const [university, setUniversity] = useState([]);
  const [universityOptions, setUniversityOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://cors-anywhere.herokuapp.com/http://202.44.139.145/api/public/opendata/univ_uni_11_03_2563"
      );
      if (res?.status === 200) {
        const data = res?.data;
        setUniversity(data);
        const options = data.map((d) => ({
          label: d.UNIV_NAME,
          value: d.UNIV_NAME,
        }));
        setUniversityOptions(options);
      }
    } catch (error) {
      console.error(error);
      alerts.err();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => fetchData(), []);

  return {
    university,
    universityOptions,
    loading,
  };
}
