import { useEffect } from "react";

import {
  Button,
  Card,
  Grid,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";

import { IconAt, IconLock, IconUser } from "@tabler/icons-react";

import { useMutation } from "@tanstack/react-query";
import { updateUserDetailsById } from "../../api/services/userService";
import ProfilePhoto from "../../components/Account/ProfilePhoto";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../components/common/Notification/Notification";
import useUserStore from "../../store/userStore";

const iconSize = 18;

const Account = () => {
  const {
    user: { id, email, name, phoneNo },
    updateUserDetails,
  } = useUserStore(({ user, updateUserDetails }) => ({
    user,
    updateUserDetails,
  }));

  const form = useForm({
    initialValues: {
      firstname: name.split(" ")[0],
      lastname: name.split(" ")[1] != undefined ? name.split(" ")[1] : "",
      username: name,
      phoneNo: phoneNo,
      password: "",
    },

    validate: {
      firstname: (value) => {
        if (!value) return "Firstname can't be empty";
        else if (value.match(/^\d/)) return "Name can't start with a number";
        else return null;
      },

      lastname: (value) =>
        value.match(/^\d/) ? "Name can't start with a number" : null,
      phoneNo: (value) =>
        /^(\+91[\s]?)?[ 0]?( 91)?[ 789]\d{10}$/.test(value)
          ? null
          : "Invalid phone number",

      password: (value) => (value ? null : "Password can't be empty"),
    },
  });

  useEffect(() => {
    const name = `${form.values.firstname} ${form.values.lastname}`;

    form.setFieldValue("username", name);
  }, [form.values.firstname, form.values.lastname]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: typeof form.values) =>
      updateUserDetailsById({
        id,
        name: values.username,
        phoneNo: values.phoneNo,
        password: values.password,
      }),
    onSuccess: (data) => {
      if (!data.name || !data.phoneNo) return;
      updateUserDetails({
        name: data.name,
        phoneNo: data.phoneNo,
      });
      showSuccessNotification("Profile updated!");
      form.setFieldValue("password", "");
    },
    onError: (error) => {
      if (error.message === "Invalid credentials!")
        form.setFieldError("password", error.message);

      showErrorNotification(error.message);
    },
  });

  return (
    <Stack>
      <Title order={1}>User Profile</Title>

      <Card>
        <Stack>
          <ProfilePhoto />

          <form
            onSubmit={form.onSubmit((values) => mutateAsync(values))}
            onReset={() => form.reset()}
          >
            <Grid columns={2} mt="xl">
              <Grid.Col span={{ sm: 2, md: 1 }}>
                <TextInput
                  label="First Name"
                  {...form.getInputProps("firstname")}
                  placeholder="John"
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 2, md: 1 }}>
                <TextInput
                  label="Last Name"
                  {...form.getInputProps("lastname")}
                  placeholder="Doe"
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 2, md: 1 }}>
                <TextInput
                  value={email}
                  disabled
                  label={"Email"}
                  leftSection={<IconAt size={iconSize} />}
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 2, md: 1 }}>
                <TextInput
                  label="Phone"
                  {...form.getInputProps("phoneNo")}
                  placeholder="+91 1234567890"
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 2, md: 1 }}>
                <TextInput
                  readOnly
                  label={"Username"}
                  leftSection={<IconUser size={iconSize} />}
                  {...form.getInputProps("username")}
                />
              </Grid.Col>

              <Grid.Col span={{ sm: 2, md: 1 }}>
                <PasswordInput
                  placeholder="Enter your password"
                  label={"Password"}
                  leftSection={<IconLock size={iconSize} />}
                  {...form.getInputProps("password")}
                  withAsterisk
                />
              </Grid.Col>
            </Grid>

            <Group mt="xl">
              <Button type="submit" loading={isPending}>
                Save
              </Button>

              <Button variant="outline" type="reset">
                Cancel
              </Button>
            </Group>
          </form>
        </Stack>
      </Card>
    </Stack>
  );
};

export default Account;
