import { Button, Group, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useUserStore from "../../store/userStore";

type InventoryControlsProps = {
  openAddModal: () => void;
};

const InventoryControls = ({ openAddModal }: InventoryControlsProps) => {
  const { role: userRole } = useUserStore((state) => state.user);

  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(
    (searchParams.get("searchQuery") as string) ?? ""
  );
  const [debounced] = useDebouncedValue(value, 200);

  useEffect(
    () =>
      setSearchParams(
        (prev) => {
          if (!debounced) prev.delete("searchQuery");
          else prev.set("searchQuery", debounced);
          return prev;
        },
        { replace: true }
      ),
    [debounced, setSearchParams]
  );

  return (
    <Group justify="space-between">
      {userRole !== "user" ? (
        <Button leftSection={<IconPlus />} onClick={openAddModal}>
          Add New
        </Button>
      ) : (
        <div></div>
      )}

      <TextInput
        leftSection={<IconSearch size={18} stroke={1.5} />}
        placeholder="Search"
        size="md"
        radius="md"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Group>
  );
};

export default InventoryControls;
