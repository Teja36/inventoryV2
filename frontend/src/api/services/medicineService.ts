const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchMedicines = async (
  searchQuery: string | null,
  sortBy: string | null,
  order: "asc" | "desc" | null,
  limit: number = 10,
  offset: number = 0
) => {
  let url = `${BASE_URL}/medicines?limit=${limit}&offset=${offset}`;

  if (searchQuery) {
    url += `&searchQuery=${searchQuery}`;
  }

  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }

  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to fetch medicines");
  }

  return response.json();
};

type Values = {
  name: string;
  potency: string;
  size: string;
  quantity: number;
  brand: string;
  row: number | null;
  col: number | null;
  shelf: string;
  rack: string;
};

const addMedicine = async (values: Values) => {
  const url = `${BASE_URL}/medicines/`;

  const { name, potency, size, quantity, brand, row, col, shelf, rack } =
    values;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      potency,
      size,
      quantity,
      brand,
      location: {
        row,
        col,
        shelf,
        rack,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add the medicine!");
  }

  return response.json();
};

const updateMedicine = async (values: Values, medicineId: string) => {
  const { name, potency, size, quantity, brand, row, col, shelf, rack } =
    values;

  const response = await fetch(`${BASE_URL}/medicines/${medicineId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      potency,
      size,
      quantity,
      brand,
      location: {
        row,
        col,
        shelf,
        rack,
      },
    }),
  });

  if (!response.ok) throw new Error("Failed to update the medicine details!");

  return response.json();
};

const deleteMedicine = async (id: string) => {
  const response = await fetch(`${BASE_URL}/medicines/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch the data.");
};

const fetchRecentlySearchedByIds = async (IDs: number[]) => {
  const response = await fetch(`${BASE_URL}/medicines/bulk-fetch`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medicineIds: IDs }),
  });

  if (!response.ok) throw new Error("Failed to fetch the data.");

  return response.json();
};

const fetchAutocompleteData = async () => {
  const response = await fetch(`${BASE_URL}/utils/medicine-autocomplete`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch the data.");

  return response.json();
};

export {
  fetchMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  fetchRecentlySearchedByIds,
  fetchAutocompleteData,
};
