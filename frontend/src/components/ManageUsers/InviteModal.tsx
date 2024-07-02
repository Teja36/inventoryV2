import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";

type InviteModalProps = {
  opened: boolean;
  handleOpened: () => void;
};

const InviteModal = ({ opened, handleOpened }: InviteModalProps) => {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      roles: null,
    },

    validate: {
      name: (value) => {
        if (value === "") return "Name is required";
        if (value.match(/^\d/)) return "Name can't start with a number";
      },

      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      roles: (value) => (value ? null : "Please select one role"),
    },
  });
  const handleInvite = () => {
    handleOpened();
    showNotification({
      message: "Invitation sent!",
      title: "Success",
      icon: <IconCheck size={16} />,
    });
  };
  return (
    <Modal
      opened={opened}
      onClose={() => handleOpened()}
      title="Invite a new User"
    >
      <form onSubmit={form.onSubmit(() => handleInvite())}>
        <TextInput
          label="Name"
          placeholder="John"
          withAsterisk
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="example@email.com"
          withAsterisk
          mt="md"
          {...form.getInputProps("email")}
        />
        <Select
          label="Role"
          placeholder="Pick one"
          mt="md"
          data={[
            { value: "Admin", label: "Admin" },
            { value: "User", label: "User" },
          ]}
          {...form.getInputProps("roles")}
          withAsterisk
        />
        <Group justify="flex-end">
          <Button type="submit" mt="md">
            Send Invite
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default InviteModal;
