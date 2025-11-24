import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d50000"];

interface PieStatisticProps {
  title: string;
  data: { name: string; value: number }[];
}

const PieStatistic: React.FC<PieStatisticProps> = ({ title, data }) => {
  return (
    <div className="text-center">
      <h4 className="text-blue-900 font-semibold mb-2">{title}</h4>
      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieStatistic;
