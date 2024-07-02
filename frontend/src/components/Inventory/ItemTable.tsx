import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";

import { IconMapPin, IconPencil, IconTrash } from "@tabler/icons-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMedicines } from "../../api/services/medicineService";
import useUserStore from "../../store/userStore";
import { Item } from "../../types/types";
import DeleteItemModal from "./DeleteItemModal";

// import "mantine-datatable/styles.layer.css";

const PAGE_SIZE = 10;

type ItemTableProps = {
  openEditModal: (item: Item) => void;
  openLocateModal: (item: Item) => void;
};

const ItemTable = ({ openEditModal, openLocateModal }: ItemTableProps) => {
  const userRole = useUserStore((state) => state.user.role);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("searchQuery");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order") as "asc" | "desc" | null;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, order]);

  // const queryClient = useQueryClient();

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["medicines", { searchQuery, sortBy, order }, currentPage],
    queryFn: () =>
      fetchMedicines(
        searchQuery,
        sortBy,
        order,
        PAGE_SIZE,
        (currentPage - 1) * PAGE_SIZE
      ),
    placeholderData: keepPreviousData,
  });

  if (isError) return <>Error</>;

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      minHeight={180}
      columns={[
        {
          accessor: "id",
          title: "#",
          // textAlignment: "right",
          width: 40,
          render: (record) => record.id,
        },
        {
          accessor: "name",
          width: "50%",
          sortable: true,
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
        { accessor: "size", title: "ml / g" },
        {
          accessor: "brand",
          sortable: true,
          render: (record) =>
            record.brand === "sbl"
              ? record.brand.toUpperCase()
              : upperFirst(record.brand),
        },
        {
          accessor: "quantity",
          title: "Quantity",
          // sortable: filter === "Quantity" ? false : true,
          sortable: true,
          render: (record) => `${record.quantity} N`,
        },
        {
          accessor: "actions",
          title: "Actions",
          render: (record: Item) => (
            <Button.Group>
              <Tooltip label="Locate">
                <ActionIcon
                  color="green"
                  variant="subtle"
                  onClick={() => openLocateModal(record)}
                >
                  <IconMapPin size={16} />
                </ActionIcon>
              </Tooltip>

              {userRole !== "user" && (
                <>
                  <Tooltip label="Edit">
                    <ActionIcon
                      color="blue"
                      variant="subtle"
                      onClick={() => openEditModal(record)}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  </Tooltip>

                  <DeleteItemModal
                    {...{
                      id: record.id,
                      name: record.name,
                      potency: record.potency,
                    }}
                  >
                    <IconTrash size={16} />
                  </DeleteItemModal>
                </>
              )}
            </Button.Group>
          ),
        },
      ]}
      records={data?.medicines}
      sortStatus={{
        columnAccessor: searchParams.get("sortBy") as string,
        direction: searchParams.get("order") as "desc" | "asc",
      }}
      onSortStatusChange={(sortStatus) => {
        setSearchParams(
          (prev) => {
            prev.set("sortBy", sortStatus.columnAccessor as string);
            prev.set("order", sortStatus.direction);
            return prev;
          },
          { replace: true }
        );
      }}
      noRecordsText="No records found!"
      recordsPerPage={PAGE_SIZE}
      totalRecords={data?.totalItems}
      page={currentPage}
      onPageChange={(p) => setCurrentPage(p)}
      loaderType="oval"
      fetching={isFetching || isLoading}
    />
  );
};

export default ItemTable;
