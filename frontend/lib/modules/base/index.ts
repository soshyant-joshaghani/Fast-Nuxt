import { createUser, deleteUser, listUsers, updateUser } from './users/api';

export const APP_NAME = 'Fast-Nuxt';

export type ManagedUser = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
};

export { createUser, deleteUser, listUsers, updateUser };
