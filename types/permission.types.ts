export type PermissionStatus = "Active" | "Inactive";

export interface Permission {
  id: number;
  name: string;
  description: string;
  group: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePermissionDto {
  name: string;
  description: string;
  group: string;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  group?: string;
}
