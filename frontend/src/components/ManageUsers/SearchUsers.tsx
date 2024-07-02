import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchUsers = () => {
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

  useEffect(() => {}, []);
  return (
    <TextInput
      placeholder="Enter name..."
      leftSection={<IconSearch />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchUsers;
