import { Box, Text, Center, Space } from "@mantine/core";

import { IconCheck, IconX } from "@tabler/icons-react";

const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => {
  return (
    <Text c={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size={14} stroke={1.5} />
        ) : (
          <IconX size={14} stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
};

const requirements = [
  { re: /[0-9]/, label: "A number" },
  { re: /[a-z]/, label: "A lowercase letter" },
  { re: /[A-Z]/, label: "An uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "A special symbol" },
];

const PasswordStrengthMeter = ({ value }: { value: string }) => {
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Text fw={700}>Password must contain:</Text>
        <Space h="xl" />

        <PasswordRequirement
          label="At least 8 characters"
          meets={value.length > 7}
        />
        {checks}
      </div>
    </Box>
  );
};

export default PasswordStrengthMeter;
