const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchUsers = async (searchQuery: string) => {
  let url = `${BASE_URL}/users`;

  if (searchQuery) {
    url += `?searchQuery=${searchQuery}`;
  }

  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) throw new Error("Failed to fetch users!");

  return response.json();
};

const updateUserDetailsById = async ({
  id,
  name,
  phoneNo,
  password,
}: {
  id: string;
  name: string;
  phoneNo: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      phoneNo,
      password,
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error);
  }

  return response.json();
};

const updateRoleOrStatusById = async (
  id: string,
  data: {
    role?: "user" | "admin";
    status?: boolean;
  }
) => {
  if (data.role === undefined && data.status === undefined)
    throw new Error("Missing data!");

  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: data.role,
      status: data.status,
    }),
  });

  if (!response.ok) throw new Error("Failed to delete user!");

  return response.json();
};

const disableUsersByIds = async (IDs: string[]) => {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userIds: IDs,
      status: true,
    }),
  });

  if (!response.ok) throw new Error("Failed to update user statuses!");

  return response.json();
};

const deleteUserById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to delete user!");
};

const deleteUsersByIds = async (IDs: string[]) => {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds: IDs }),
  });

  if (!response.ok) throw new Error("Failed to delete users");
};

const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const response = await fetch(`${BASE_URL}/upload/profile`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to update the avatar!");

  return response.json();
};

export {
  fetchUsers,
  updateUserDetailsById,
  updateRoleOrStatusById,
  disableUsersByIds,
  deleteUserById,
  deleteUsersByIds,
  updateAvatar,
};
