import api from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import {
  PermissionStatus,
  CreatePermissionDto,
  Permission,
  UpdatePermissionDto,
} from "@/types/permission.types";

export type GetPermissionsParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: PermissionStatus;
};

export const permissionService = {
  // GET /permissions — paginated, return full envelope for meta + links
  async getAll(params: GetPermissionsParams = {}): Promise<PaginatedResponse<Permission>> {
    const { data } = await api.get<PaginatedResponse<Permission>>("/permissions", {
      params: {
        sortBy: "name",
        order: "asc",
        status: "Active",
        ...params,
      },
    });
    return data;
  },

  // GET /permissions/:id
  async getOne(id: number): Promise<Permission> {
    const { data } = await api.get<ApiResponse<Permission>>(`/permissions/${id}`);
    return data.data;
  },

  // POST /permissions
  async create(dto: CreatePermissionDto): Promise<Permission> {
    const { data } = await api.post<ApiResponse<Permission>>("/permissions", dto);
    return data.data;
  },

  // PATCH /permissions/:id
  async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
    const { data } = await api.patch<ApiResponse<Permission>>(`/permissions/${id}`, dto);
    return data.data;
  },

  // PATCH /permissions/:id/archive
  async archive(id: number): Promise<Permission> {
    const { data } = await api.patch<ApiResponse<Permission>>(`/permissions/${id}/archive`);
    return data.data;
  },
};
