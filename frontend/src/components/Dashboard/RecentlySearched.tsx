import { Card, Text } from "@mantine/core";

import { DataTable } from "mantine-datatable";

import { upperFirst, useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentlySearchedByIds } from "../../api/services/medicineService";

const RecentlySearched = ({ className }: { className: string }) => {
  const [recent] = useLocalStorage<number[]>({
    key: "recently-searched",
    defaultValue: [],
  });

  const {
    data: records,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recently-searched", recent],
    queryFn: () => fetchRecentlySearchedByIds(recent),
    enabled: recent.length > 0,
  });

  if (isError) return <>Error: Something went wrong!</>;

  return (
    <Card className={className}>
      <Text fw={600}>Recently searched</Text>
      <DataTable
        minHeight={150}
        highlightOnHover
        records={records}
        idAccessor="id"
        columns={[
          {
            accessor: "id",
            title: "#",
            textAlign: "right",
            width: 40,
            render: (record) => record.id,
          },
          {
            accessor: "name",
            width: "60%",
            render: (record) => {
              return record.name
                .split(" ")
                .map((word: string) => upperFirst(word))
                .join(" ");
            },
          },
          {
            accessor: "potency",
            render: (record) => record.potency.toUpperCase(),
          },
        ]}
        fetching={isLoading}
        loaderType="oval"
        noRecordsText="No records found"
      />
    </Card>
  );
};

export default RecentlySearched;
