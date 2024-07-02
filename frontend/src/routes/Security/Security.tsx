import {
  Button,
  Card,
  Grid,
  Group,
  PasswordInput,
  Space,
  Stack,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../api/services/authService";
import PasswordStrengthMeter from "../../components/Security/PasswordStrengthMeter";
import { showSuccessNotification } from "../../components/common/Notification/Notification";

const Security = () => {
  const form = useForm({
    initialValues: {
      current: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      current: (value) => !value && "Please enter your current password",
      password: (value, values) => {
        let msg = null;
        if (value.length < 8) msg = "Length must be atleast 8 characters";
        else if (value === values.current) msg = "Enter a new password";
        return msg;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords didn't match" : null,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: typeof form.values) =>
      updatePassword(values.current, values.password),
    onSuccess: (data) => {
      form.reset();
      showSuccessNotification(data.message);
    },
    onError: (error) => {
      if (error.message === "Wrong password!")
        form.setFieldError("current", error.message);
      else if (error.message.startsWith("Password must"))
        form.setFieldError("password", error.message);
      else form.setFieldError("confirmPassword", error.message);
    },
  });

  return (
    <>
      <Title order={1}>Security</Title>
      <Space h="xl" />

      <Card>
        <Stack>
          <Grid align="center">
            <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 2, sm: 1 }}>
              <form
                onSubmit={form.onSubmit((values) => mutateAsync(values))}
                onReset={() => form.reset()}
              >
                <Stack>
                  <PasswordInput
                    label="Current password"
                    placeholder="Current password"
                    withAsterisk
                    {...form.getInputProps("current")}
                  />
                  <PasswordInput
                    label="New password"
                    placeholder="New password"
                    withAsterisk
                    {...form.getInputProps("password")}
                  />

                  <PasswordInput
                    label="Confirm password"
                    placeholder="Confirm password"
                    withAsterisk
                    {...form.getInputProps("confirmPassword")}
                  />

                  <Group>
                    <Button type="submit" loading={isPending}>
                      Save
                    </Button>

                    <Button type="reset" variant="outline">
                      Cancel
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }} order={{ base: 1, sm: 2 }}>
              <PasswordStrengthMeter value={form.values.password} />
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </>
  );
};

export default Security;
