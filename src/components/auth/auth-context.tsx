import { createContext } from "react";

const user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: undefined | null | string
} = {
  id: "",
  name: "",
  email: "",
  createdAt: new Date(0),
  updatedAt: new Date(0),
} ;

export const AuthContext = createContext(user);
