import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

type TrendSparklineProps = {
  data: number[];
  color?: string;
  height?: number;
};

export const TrendSparkline = ({ data, color = "#2563EB", height = 36 }: TrendSparklineProps) => {
  const chartData = data.map((v, i) => ({ x: i, y: v }));
  return (
    <div className="w-24 h-9 sm:w-28 sm:h-9">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={false}
            formatter={(v: any) => [v, "Value"]}
            contentStyle={{ fontSize: 12, padding: "4px 8px" }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            fill="url(#sparkFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};