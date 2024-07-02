import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";

import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
// import Logo from "../../components/common/Logo";
import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../../api/services/authService";
import useUserStore from "../../store/userStore";
import classes from "./Login.module.css";

const Login = () => {
  const setUser = useUserStore((state) => state.setUser);

  const navigate = useNavigate();

  const [type, toggle] = useToggle(["login", "register"]);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      phoneNo: "",
      terms: false,
    },

    validate: (values) => {
      if (type === "login") {
        return {
          email: /\S+@\S+\.\S+/.test(values.email)
            ? null
            : "Please enter a valid email.",
          password:
            values.password.length < 6
              ? "Password should include at least 6 characters."
              : null,
        };
      } else {
        return {
          name: !values.name
            ? "Name can't be empty"
            : values.name.match(/^\d/)
            ? "Name can't start with a number"
            : null,
          email: /\S+@\S+\.\S+/.test(values.email)
            ? null
            : "Please enter a valid email.",
          phoneNo: /^(\+91[\s]?)?[ 0]?( 91)?[ 789]\d{10}$/.test(values.phoneNo)
            ? null
            : "Invalid phoneNo number",
          password:
            values.password.length < 6
              ? "Password should include at least 6 characters."
              : null,
        };
      }
    },
  });

  const { mutateAsync: handleLogin, isPending: isLoginPending } = useMutation({
    mutationFn: () => loginUser(form.values.email, form.values.password),
    onSuccess: (data) => {
      setUser(data);
      navigate("/");
    },
    onError: (error) => {
      form.setFieldError("password", error.message);
    },
  });

  const { mutateAsync: handleRegister, isPending: isRegisterPending } =
    useMutation({
      mutationFn: () =>
        registerUser(
          form.values.name,
          form.values.email,
          form.values.phoneNo,
          form.values.password
        ),
      onSuccess: (data) => {
        setUser(data);
        navigate("/");
      },
      onError: (error) => {
        form.setFieldError("password", error.message);
      },
    });

  const handleSubmit = async () => {
    if (type === "register") handleRegister();
    else handleLogin();
  };

  const handleForgotPassword = async () => {
    form.validateField("email");
    // const isMailSent = await sendPasswordResetMail(form.values.email);
    const isMailSent = true;
    if (isMailSent)
      showNotification({
        title: "Email sent!",
        message: "Check your inbox for password reset link.",
      });
  };

  return (
    <Paper radius="md" p="xl" withBorder shadow="md" className={classes.paper}>
      <Center>{/* <Logo size={140} /> */}</Center>
      <Title order={1} ta="center">
        {upperFirst(type)}
      </Title>

      <Space h="md" />

      <form
        onSubmit={form.onSubmit(() => {
          handleSubmit();
        })}
      >
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              withAsterisk
              {...form.getInputProps("name")}
            />
          )}

          <TextInput
            label="Email"
            placeholder="hello@gmail.com"
            {...form.getInputProps("email")}
            withAsterisk
          />

          {type === "register" && (
            <TextInput
              label="phoneNo"
              placeholder="+91 1234567890"
              withAsterisk
              {...form.getInputProps("phoneNo")}
            />
          )}

          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            withAsterisk
          />

          {type === "login" && (
            <Anchor
              ta="left"
              component="button"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Anchor>
          )}

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              {...form.getInputProps("terms", { type: "checkbox" })}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => {
              toggle();
              form.clearErrors();
            }}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            type="submit"
            loading={isLoginPending || isRegisterPending}
            disabled={type === "register" && !form.values.terms}
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default Login;
