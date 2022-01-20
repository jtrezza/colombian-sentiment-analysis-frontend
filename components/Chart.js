import { useEffect } from "react";
import c3 from "c3";
import 'c3/c3.css';

const Chart = ({ id, chartProps }) => {
  useEffect(() => {
    c3.generate({
      bindto: `#${id}`,
      ...chartProps,
    });
  }, []);
  
  return <div id={id} className="chart" />;
};

export default Chart