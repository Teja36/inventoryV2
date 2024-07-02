import { useState } from "react";
import { Select } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleOrStatusById } from "../../api/services/userService";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../common/Notification/Notification";
import useUserStore from "../../store/userStore";

type Role = "user" | "admin";

type RoleDropDownProps = {
  id: string;
  role: Role;
};
const RoleDropDown = ({ id, role }: RoleDropDownProps) => {
  const userId = useUserStore((state) => state.user.id);

  const [value, setValue] = useState(role);

  const queryClient = useQueryClient();

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateRoleOrStatusById(id, { role }),
    onSuccess: () => {
      showSuccessNotification("Role updated!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  return (
    <Select
      disabled={userId === id}
      variant="unstyled"
      style={{ width: "100px" }}
      size="sm"
      value={value}
      onChange={(newValue) => {
        setValue(newValue as Role);
        updateRole({ id, role: newValue as Role });
      }}
      data={[
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ]}
    />
  );
};

export default RoleDropDown;
