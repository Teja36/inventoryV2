import { useState } from "react";
import { Switch, useMantineTheme } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleOrStatusById } from "../../api/services/userService";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../common/Notification/Notification";
import useUserStore from "../../store/userStore";

type StatusSwitchProps = {
  id: string;
  status: boolean;
};

const StatusSwitch = ({ id, status }: StatusSwitchProps) => {
  const theme = useMantineTheme();

  const userId = useUserStore((state) => state.user.id);

  const [checked, setChecked] = useState(status);

  const queryClient = useQueryClient();

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      updateRoleOrStatusById(id, { status }),
    onSuccess: () => {
      showSuccessNotification("Status updated!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong");
      setChecked((prev) => !prev);
    },
  });

  return (
    <Switch
      disabled={userId === id}
      size="lg"
      color="green"
      onLabel="Active"
      offLabel="Disabled"
      checked={!checked}
      onChange={() => {
        setChecked((prev) => {
          updateStatus({ id, status: !prev });
          return !prev;
        });
      }}
      thumbIcon={
        checked ? (
          <IconX size={12} color={theme.colors.red[5]} stroke={3} />
        ) : (
          <IconCheck size={12} color={theme.colors.teal[5]} stroke={3} />
        )
      }
    />
  );
};

export default StatusSwitch;
