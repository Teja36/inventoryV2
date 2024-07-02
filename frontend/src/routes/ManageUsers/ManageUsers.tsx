import { useState } from "react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";

import {
  IconChevronDown,
  IconCircleOff,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { upperFirst } from "@mantine/hooks";

import { openConfirmModal } from "@mantine/modals";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserById,
  deleteUsersByIds,
  disableUsersByIds,
  fetchUsers,
} from "../../api/services/userService";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../components/common/Notification/Notification";
import InviteModal from "../../components/ManageUsers/InviteModal";
import RoleDropDown from "../../components/ManageUsers/RoleDropDown";
import SearchUsers from "../../components/ManageUsers/SearchUsers";
import StatusSwitch from "../../components/ManageUsers/StatusSwitch";
import useUserStore from "../../store/userStore";
import { Item } from "../../types/types";
import { useSearchParams } from "react-router-dom";

const ManageUsers = () => {
  const { id: userId, role: userRole } = useUserStore((state) => state.user);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [opened, setOpened] = useState(false);

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("searchQuery") ?? "";

  const queryClient = useQueryClient();

  const { isLoading, data: users } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => fetchUsers(searchQuery),
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (id: string) => deleteUserById(id),
    onSuccess: () => {
      showSuccessNotification("User deleted!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  const { mutateAsync: deleteUsers } = useMutation({
    mutationFn: (IDs: string[]) => deleteUsersByIds(IDs),
    onSuccess: () => {
      showSuccessNotification("User(s) deleted!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  const { mutateAsync: disableUsers } = useMutation({
    mutationFn: (IDs: string[]) => disableUsersByIds(IDs),
    onSuccess: () => {
      showSuccessNotification("User(s) updated!");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  const handleActions = (action: string) => {
    const userIDs = selectedRecords.flatMap((record: Item) =>
      record.id === userId ? [] : record.id
    );

    if (userIDs.length === 0) return;

    if (action === "Remove") deleteUsers(userIDs);
    else if (action === "Disable") disableUsers(userIDs);

    setSelectedRecords([]);
  };

  const openDeleteModal = (id: string, name: string) =>
    openConfirmModal({
      title: "Remove Account",
      children: (
        <Text size="sm">
          Are you sure you want to remove{" "}
          <Text component="strong" fw={700}>
            {name}
          </Text>
          's account? This action is destructive and you will have to contact
          support to restore your data.
        </Text>
      ),
      labels: { confirm: "Remove account", cancel: "No don't remove it" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteUser(id),
    });

  return (
    <>
      <Title order={1}> Users</Title>
      <Space h="md" />
      <Card style={{ minHeight: "80vh" }}>
        <Stack gap="xs">
          <Group justify="space-between">
            <Group>
              <Button
                leftSection={<IconPlus />}
                onClick={() => setOpened(true)}
              >
                Invite User
              </Button>
              {userRole !== "user" && (
                <Menu
                  shadow="md"
                  withArrow
                  width="PopoverWidth"
                  position="bottom-end"
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      disabled={!selectedRecords.length || userRole === "user"}
                      rightSection={<IconChevronDown size={20} />}
                    >
                      Actions
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    onClick={(e) =>
                      handleActions((e.target as HTMLButtonElement).innerText)
                    }
                  >
                    <Menu.Item leftSection={<IconCircleOff size={20} />}>
                      Disable
                    </Menu.Item>
                    <Menu.Item leftSection={<IconTrash size={20} />}>
                      Remove
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
            <SearchUsers />
          </Group>
          <Space h="xs" />
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            minHeight={150}
            records={users}
            columns={[
              {
                accessor: "user",
                render: ({ name, photoUrl }) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={photoUrl} alt={name} radius="50%" size={52} />
                    <Text ml="xs">{name}</Text>
                  </div>
                ),
              },
              {
                accessor: "email",
              },
              { accessor: "phoneNo" },
              {
                accessor: "role",
                render: ({ id, role }) => {
                  if (userRole === "user") return upperFirst(role);

                  return <RoleDropDown id={id} role={role} />;
                },
              },
              {
                accessor: "status",
                render: ({ id, status }) => {
                  if (userRole === "user")
                    return (
                      <Badge color={!status ? "green" : "red"}>
                        {!status ? "Active" : "Disabled"}
                      </Badge>
                    );

                  return <StatusSwitch id={id} status={status} />;
                },
              },
              {
                accessor: "action",
                visibleMediaQuery: () =>
                  userRole === "user" ? "width: 0" : "",
                render: ({ id, name }) => {
                  return (
                    <Button
                      onClick={() => openDeleteModal(id, name)}
                      leftSection={<IconTrash size={16} />}
                      size="sm"
                      variant="light"
                      color="red"
                      disabled={userRole === "user" || userId === id}
                    >
                      Remove
                    </Button>
                  );
                },
              },
            ]}
            fetching={isLoading}
            {...(userRole !== "user"
              ? {
                  selectedRecords: selectedRecords,
                  onSelectedRecordsChange: setSelectedRecords,
                }
              : {})}
          />
        </Stack>
      </Card>
      <InviteModal opened={opened} handleOpened={() => setOpened(false)} />
    </>
  );
};

export default ManageUsers;
