import { User } from "./User";

export interface Declaration {
  id?: string;
  year: string;
  values: {
    rent: number;
    deduction: number;
  }
  status?: string;
  has_rectified?: boolean;
  user?: User
  createdAt?: Date
}
