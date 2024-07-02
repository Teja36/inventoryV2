import { useEffect, useState } from "react";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  FileButton,
  Group,
  Title,
} from "@mantine/core";

import { IconPencil } from "@tabler/icons-react";

import { useMutation } from "@tanstack/react-query";
import { updateAvatar } from "../../api/services/userService";
import useUserStore from "../../store/userStore";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../common/Notification/Notification";
import classes from "./ProfilePhoto.module.css";

const ProfilePhoto = () => {
  const {
    user: { name, photoUrl },
    updatePhotoUrl,
  } = useUserStore(({ user, updatePhotoUrl }) => ({ user, updatePhotoUrl }));

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(photoUrl);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (file: File) => updateAvatar(file),
    onSuccess: (data) => {
      updatePhotoUrl(data.photoUrl);
      showSuccessNotification("Profile photo updated!");
      setFile(null);
    },
    onError: () => showErrorNotification("Something went wrong!"),
  });

  return (
    <Box>
      <Box className={classes.banner}></Box>

      <Box className={classes.wrapper}>
        <Box className={classes.profile}>
          <Card radius="50%" p="sm">
            <Avatar src={preview} radius="50%" size={100} />
          </Card>

          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <ActionIcon
                {...props}
                variant="filled"
                className={classes.button}
              >
                <IconPencil size={16} />
              </ActionIcon>
            )}
          </FileButton>
        </Box>
        <Title className={classes.title} order={2}>
          {name}
        </Title>

        {file && (
          <Group className={classes.buttonGroup}>
            <Button onClick={() => mutateAsync(file)} loading={isPending}>
              Save Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPreview(photoUrl);
                setFile(null);
              }}
            >
              Cancel
            </Button>
          </Group>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePhoto;
