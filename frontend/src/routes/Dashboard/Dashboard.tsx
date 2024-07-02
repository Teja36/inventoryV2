import { Box, Card, Space, Text, Title } from "@mantine/core";
import {
  IconClock,
  IconMedicineSyrup,
  IconReportSearch,
  IconUser,
} from "@tabler/icons-react";
import DonutChart from "../../components/Dashboard/DonutChart";
import RecentlySearched from "../../components/Dashboard/RecentlySearched";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "../../api/services/utilService";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    initialData: {
      userCount: 0,
      medicineCount: 0,
      searchCount: 0,
      timeSaved: "0hrs",
    },
    // staleTime: 60 * 1000,
  });

  return (
    <>
      <Title order={1}>Dashboard</Title>
      <Space h="md" />

      <Box className={classes.wrapper}>
        <Card className={classes.card1}>
          <span className={classes.icon}>
            <IconUser size={40} />
          </span>
          <span>
            <Text size="sm" c="dimmed">
              Users
            </Text>
            <Text size="xl" fw={700}>
              {dashboardData.userCount}
            </Text>
          </span>
        </Card>

        <Card className={classes.card2}>
          <span className={classes.icon}>
            <IconMedicineSyrup size={40} />
          </span>
          <span>
            <Text size="sm" c="dimmed">
              Medicines
            </Text>
            <Text size="xl" fw={700}>
              {dashboardData.medicineCount}
            </Text>
          </span>
        </Card>

        <Card className={classes.card3}>
          <span className={classes.icon}>
            <IconReportSearch size={40} />
          </span>
          <span>
            <Text size="sm" c="dimmed">
              Searches
            </Text>
            <Text size="xl" fw={700}>
              {dashboardData.searchCount}
            </Text>
          </span>
        </Card>

        <Card className={classes.card4}>
          <span className={classes.icon}>
            <IconClock size={40} />
          </span>
          <span>
            <Text size="sm" c="dimmed">
              Time saved
            </Text>
            <Text size="xl" fw={700}>
              {dashboardData.timeSaved}
            </Text>
          </span>
        </Card>

        <DonutChart className={classes.chart} />

        <RecentlySearched className={classes.table} />
      </Box>
    </>
  );
};

export default Dashboard;
