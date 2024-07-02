import { Card, Modal, Space, Stack, Title } from "@mantine/core";
import { useState } from "react";
import InventoryControls from "../../components/Inventory/InventoryControls";
import ItemTable from "../../components/Inventory/ItemTable";
import AddItemModal from "../../components/Inventory/AddItemModal";
import EditItemModal from "../../components/Inventory/EditItemModal";
import LocateModal from "../../components/Inventory/LocateModal/LocateModal";
import { Item } from "../../types/types";

const Inventory = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleCloseLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const openEditModal = (currentItem: Item) => {
    setItem(currentItem);
    setIsEditModalOpen(true);
  };
  const openLocateModal = (currentItem: Item) => {
    setItem(currentItem);
    setIsLocationModalOpen(true);
  };

  return (
    <>
      <Title order={1}>Inventory</Title>
      <Space h="md" />
      <Card>
        <Stack>
          <InventoryControls openAddModal={() => setIsAddModalOpen(true)} />

          <ItemTable
            openEditModal={openEditModal}
            openLocateModal={openLocateModal}
          />
        </Stack>
      </Card>

      <Modal
        title="Add new item"
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AddItemModal handleClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal
        title="Edit item"
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <EditItemModal
          item={item as Item}
          handleClose={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        centered
        title="Location:"
        opened={isLocationModalOpen}
        onClose={handleCloseLocationModal}
      >
        <LocateModal item={item as Item} />
      </Modal>
    </>
  );
};

export default Inventory;
