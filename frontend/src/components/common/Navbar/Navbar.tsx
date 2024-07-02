import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBuildingWarehouse,
  IconFingerprint,
  IconGauge,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/services/authService";
import useUserStore from "../../../store/userStore";
import classes from "./Navbar.module.css";

// import Logo from "./Logo";

const data = [
  { link: "/", label: "Inventory", icon: IconBuildingWarehouse },
  { link: "/dashboard", label: "Dashboard", icon: IconGauge },
  { link: "/account", label: "Account", icon: IconUser },
  { link: "/security", label: "Security", icon: IconFingerprint },
  { link: "/users", label: "Users", icon: IconUsers },
];

export function Navbar({
  opened,
  toggle,
}: {
  opened: boolean;
  toggle: () => void;
}) {
  const {
    user: { name, role, photoUrl },
    clearUser,
  } = useUserStore(({ user, clearUser }) => ({ user, clearUser }));

  const [active, setActive] = useState(0);

  const location = useLocation();

  const navigate = useNavigate();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const index = data.findIndex(
      (link) => link.label.toLowerCase() === location.pathname.slice(1)
    );

    setActive(index === -1 ? 0 : index);
  }, [location]);

  const { mutateAsync: hanldeLogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUser();
      navigate("/login");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const links = data.map((item, index) => (
    <UnstyledButton
      className={clsx(classes.link, {
        [classes.linkActive]: index === active,
      })}
      // href={item.link}
      key={item.label}
      onClick={() => {
        navigate(item.link);
        toggle();
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </UnstyledButton>
  ));

  //TODO: Make navbar responsive
  return (
    <>
      <AppShell.Section className={classes.header}>
        {/* <Logo size={72} /> */}
        {/* <Text weight="bold" color="white" size={26}>
          Inventory
        </Text> */}
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text fw={700} c="white" size="xl">
            Inventory
          </Text>
        </Group>
      </AppShell.Section>

      <AppShell.Section className={classes.header}>
        <Stack align="center" justify="flex-start" gap="lg">
          <Avatar src={photoUrl} size="xl" radius={50} />
          <Text fw={500} c="gray.0">
            {name}
          </Text>
          <Text tt="capitalize" c="gray.3">
            {role}
          </Text>
        </Stack>
      </AppShell.Section>
      <AppShell.Section grow>{links}</AppShell.Section>
      <AppShell.Section className={classes.footer}>
        <UnstyledButton
          className={classes.link}
          onClick={() => {
            toggleColorScheme();
            toggle();
          }}
        >
          {colorScheme === "dark" ? (
            <IconSun className={classes.linkIcon} stroke={1.5} />
          ) : (
            <IconMoonStars className={classes.linkIcon} stroke={1.5} />
          )}

          <span>{colorScheme === "dark" ? "Light theme" : "Dark theme"}</span>
        </UnstyledButton>

        <UnstyledButton className={classes.link} onClick={() => hanldeLogout()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </UnstyledButton>
      </AppShell.Section>
    </>
  );
}

export default Navbar;
