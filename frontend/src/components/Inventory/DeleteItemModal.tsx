import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { upperFirst } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedicine } from "../../api/services/medicineService";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../common/Notification/Notification";

type DeleteItemModalProps = {
  id: string;
  name: string;
  potency: string;
  children: React.ReactNode;
};
const DeleteItemModal = ({
  id,
  name,
  potency,
  children,
}: DeleteItemModalProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteMedicineByID } = useMutation({
    mutationFn: (id: string) => deleteMedicine(id),
    onSuccess: () => {
      showSuccessNotification("Item deleted!");
      queryClient.invalidateQueries({
        queryKey: ["medicines"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Delete your profile",
      centered: true,
      children: (
        <>
          <Text size="sm">Are you sure you want to delete this item ?</Text>
          <Text fw={700} mt="md">
            {name
              .split(" ")
              .map((word) => upperFirst(word))
              .join(" ")}{" "}
            {potency.toUpperCase()}
          </Text>
        </>
      ),
      labels: { confirm: "Delete Item", cancel: "No don't delete it" },
      confirmProps: { color: "red" },

      onConfirm: () => deleteMedicineByID(id),
    });

  return (
    <Tooltip label="Delete">
      <ActionIcon c="red" variant="subtle" onClick={openDeleteModal}>
        {children}
      </ActionIcon>
    </Tooltip>
  );
};

export default DeleteItemModal;
