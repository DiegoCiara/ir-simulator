import { User } from "./User";

export interface Declaration {
  id?: string;
  year: string;
  values: {
    rent: number;
    deduction: number;
  }
  status?: string;
  user?: User
}
