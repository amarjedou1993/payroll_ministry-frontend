import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";

interface DonutChartCardProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

export const DonutChartCard = ({ data, title }: DonutChartCardProps) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="shadow-md w-full">
      <Card.Content className="relative z-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>

        <div className="relative flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={180}
                endAngle={-180}
                paddingAngle={4}
                blendStroke
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#CCCCCC"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm">Totals</p>
            <p className="text-xl font-semibold">${total.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between w-full mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center">
                <div
                  className="w-2 h-6 rounded-lg"
                  style={{ background: item.color }}
                ></div>
                <p className="ml-2 text-lg font-medium">
                  ${item.value.toLocaleString()}
                </p>
              </div>
              <p className="text-gray-500 text-sm">{item.name}</p>
            </div>
          ))}
        </div>

        {/* <button className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm">
          More details
        </button> */}
      </Card.Content>
    </Card>
  );
};
