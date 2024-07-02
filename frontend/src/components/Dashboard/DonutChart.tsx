import { Card, Space, Text, useComputedColorScheme } from "@mantine/core";

import Chart from "react-apexcharts";

import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "../../api/services/utilService";

type SeriesData = {
  [key: string]: number;
};

const DonutChart = ({ className }: { className: string }) => {
  const colorScheme = useComputedColorScheme();

  const matches = useMediaQuery("(max-width: 400px)");

  const { isLoading, data } = useQuery({
    queryKey: ["dashboard-graph"],
    queryFn: fetchGraphData,
  });

  if (isLoading) return <>Loading...</>;

  return (
    <Card className={className}>
      <Text fw={600}>Items by potency</Text>
      <Space h="lg" />
      <Card.Section
        style={{
          width: "100%",
        }}
      >
        <Chart
          height={matches ? "100%" : 400}
          type="donut"
          series={Object.values(data as SeriesData)}
          options={{
            legend: {
              fontSize: "13px",
              fontWeight: 600,
              // position: "bottom",
              show: matches ? false : true,
            },
            chart: {
              background: "transparent",
              foreColor: colorScheme === "dark" ? "#c1c2c5" : "#000",
            },
            stroke: { show: false },
            labels: Object.keys(data).map((item) => item.toUpperCase()),
            theme: {
              mode: colorScheme,
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      fontWeight: "bold",
                    },
                  },
                },
              },
            },
          }}
        />
      </Card.Section>
    </Card>
  );
};

export default DonutChart;
