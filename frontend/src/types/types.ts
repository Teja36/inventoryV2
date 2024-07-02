export type Item = {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  potency: string;
  size: string;
  location: Location;
};

export type Location = {
  row: number;
  col: number;
  shelf: "left" | "right" | "bottom";
  rack: "top" | "middle" | "bottom" | "";
};

export type User = {
  id: string;
  name: string;
  photoUrl?: string | undefined;
  email: string;
  phoneNo: string;
  role: "user" | "admin";
  status: boolean;
};
