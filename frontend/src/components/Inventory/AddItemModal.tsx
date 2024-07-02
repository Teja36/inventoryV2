import { useEffect, useState } from "react";

import {
  Autocomplete,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";

import { useForm } from "@mantine/form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMedicine,
  fetchAutocompleteData,
} from "../../api/services/medicineService";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../common/Notification/Notification";

type AddItemModalProps = {
  handleClose: () => void;
};

const racks = {
  left: ["top", "bottom"],
  right: ["top", "middle", "bottom"],
  bottom: [],
};

type RacksType = typeof racks;

const AddItemModal = ({ handleClose }: AddItemModalProps) => {
  const [rackData, setRackData] = useState<string[]>([]);

  const [step, setStep] = useState(0);

  const form = useForm({
    initialValues: {
      name: "",
      potency: "",
      size: "",
      brand: "",
      quantity: 1,
      shelf: "",
      rack: "",
      row: null,
      col: null,
    },

    validate: (values) => {
      if (step === 0) {
        return {
          name: values.name ? null : "Name can't be empty",
          potency: values.potency ? null : "This field is required",
          size: values.size ? null : "This field is required",
          brand: values.brand ? null : "This field is required",
        };
      }

      if (step === 1) {
        return {
          shelf: values.shelf ? null : "This field is required",
          rack:
            rackData.length > 0 && !values.rack
              ? "This field is required"
              : null,
          row: values.row ? null : "This field is required",
          col: values.col ? null : "This field is required",
        };
      }
      return {};
    },
  });

  useEffect(() => {
    if (!form.values.shelf) return;
    setRackData(racks[form.values.shelf as keyof RacksType]);
  }, []);

  useEffect(() => {
    if (!form.values.shelf) return;

    if (form.isDirty("shelf")) {
      setRackData(racks[form.values.shelf as keyof RacksType]);
      form.setFieldValue("rack", "");
    }
  }, [form.values.shelf]);

  const queryClient = useQueryClient();

  const { isLoading, data: autoCompleteData } = useQuery({
    queryKey: ["auto-complete"],
    queryFn: fetchAutocompleteData,
    staleTime: 1000,
  });

  const { mutate } = useMutation({
    mutationFn: addMedicine,
    onMutate: () => {
      form.reset();
      handleClose();
    },
    onSuccess: () => {
      showSuccessNotification("Medicine added!");
      queryClient.invalidateQueries({
        queryKey: ["medicines"],
      });
    },
    onError: () => {
      showErrorNotification("Something went wrong!");
    },
  });

  const handleCancel = () => {
    form.reset();
    handleClose();
  };

  if (isLoading)
    return (
      <div style={{ width: 400, height: 320, position: "relative" }}>
        <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
      </div>
    );

  return (
    <>
      <Text mb="md">{step === 0 ? "Details" : "Location"}:</Text>
      <form
        onSubmit={form.onSubmit((values) => mutate(values))}
        onReset={handleCancel}
      >
        <Grid gutter="md" grow columns={2}>
          {step === 0 && (
            <>
              <Grid.Col span={2}>
                <TextInput
                  label="Name"
                  placeholder="Medicine name"
                  withAsterisk
                  {...form.getInputProps("name")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <Autocomplete
                  label="Potency"
                  data={autoCompleteData.potency}
                  placeholder="Ex: 10M"
                  withAsterisk
                  {...form.getInputProps("potency")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <Autocomplete
                  label="Size"
                  data={autoCompleteData.size}
                  placeholder="Ex: 100ml"
                  withAsterisk
                  {...form.getInputProps("size")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <Autocomplete
                  label="Brand"
                  data={autoCompleteData.brand}
                  placeholder="Pick one"
                  withAsterisk
                  {...form.getInputProps("brand")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <NumberInput
                  defaultValue={1}
                  label="Quantity"
                  // description="Maximum 10"
                  min={1}
                  max={10}
                  withAsterisk
                  {...form.getInputProps("quantity")}
                />
              </Grid.Col>
            </>
          )}

          {step === 1 && (
            <>
              <Grid.Col span={1}>
                <Select
                  data={["left", "right", "bottom"]}
                  label="Shelf"
                  placeholder="Pick one"
                  withAsterisk
                  allowDeselect={false}
                  {...form.getInputProps("shelf")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <Select
                  data={rackData}
                  label="Rack"
                  placeholder="Pick one"
                  withAsterisk
                  allowDeselect={false}
                  disabled={rackData.length === 0}
                  {...form.getInputProps("rack")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <NumberInput
                  label="Column"
                  withAsterisk
                  min={1}
                  {...form.getInputProps("col")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <NumberInput
                  label="Row"
                  withAsterisk
                  min={1}
                  {...form.getInputProps("row")}
                />
              </Grid.Col>
            </>
          )}

          <Grid.Col span={2}>
            <Group mt="xl" justify="flex-end">
              {step === 0 && (
                <>
                  <Button type="reset" variant="outline">
                    Cancel
                  </Button>

                  <Button
                    onClick={() => {
                      form.validate();
                      if (form.isValid()) setStep(1);
                    }}
                  >
                    Next
                  </Button>
                </>
              )}

              {step === 1 && (
                <>
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Back
                  </Button>

                  <Button type="submit">Add</Button>
                </>
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
};

export default AddItemModal;
