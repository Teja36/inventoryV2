import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";

const showErrorNotification = (message: string) => {
  showNotification({
    title: "Error!",
    message,
    color: "red",
    icon: <IconAlertTriangle size={16} />,
  });
};

const showSuccessNotification = (message: string) => {
  showNotification({
    title: "Success",
    message,
    icon: <IconCheck size={16} />,
  });
};

export { showErrorNotification, showSuccessNotification };
