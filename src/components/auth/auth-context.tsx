import { createContext } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: undefined | null | string;
} ;

export const AuthContext = createContext<User | null>(null);
