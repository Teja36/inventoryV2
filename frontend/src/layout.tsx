import {
  AppShell,
  Burger,
  Container,
  Flex,
  Group,
  Loader,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/common/Navbar/Navbar";

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      layout="alt"
      header={{ height: 60, offset: false }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>Inventory</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        p="md"
        style={{
          backgroundColor: "var(--mantine-primary-color-filled)",
        }}
      >
        <Navbar opened={opened} toggle={toggle} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Suspense
          fallback={
            <Container>
              <Flex justify="center" align="center" mih={"100dvh"}>
                <Loader size={50} />
              </Flex>
            </Container>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
