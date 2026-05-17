"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  ArchiveX,
  LayoutGrid,
  List,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { permissionService } from "@/services/permission.service";
import {
  CreatePermissionDto,
  Permission,
  PermissionStatus,
  UpdatePermissionDto,
} from "@/types/permission.types";

type ViewMode = "table" | "cards";

const EMPTY_FORM: CreatePermissionDto = { name: "", description: "", group: "" };

// ─── Query Keys ─────────────────────────────────────────────────────────────

export const permissionKeys = {
  all: ["permissions"] as const,
  list: (status: PermissionStatus) => ["permissions", "list", status] as const,
  paged: (status: PermissionStatus, page: number) => ["permissions", "list", status, page] as const, // ✅ stable tuple
};

// ─── Error Helper ────────────────────────────────────────────────────────────

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    return msg ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

// ─── Permission Form ─────────────────────────────────────────────────────────

interface PermissionFormProps {
  form: CreatePermissionDto;
  groups: string[];
  onChange: (field: keyof CreatePermissionDto, value: string) => void;
  isSubmitting: boolean;
}

function PermissionForm({ form, groups, onChange, isSubmitting }: PermissionFormProps) {
  const [customGroup, setCustomGroup] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="perm-name">Permission name</Label>
        <Input
          id="perm-name"
          placeholder="e.g. view:transactions"
          value={form.name}
          disabled={isSubmitting}
          onChange={e => onChange("name", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Recommended convention:{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">action:resource</code>
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Group</Label>
        {customGroup || groups.length === 0 ? (
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Finance"
              value={form.group}
              disabled={isSubmitting}
              onChange={e => onChange("group", e.target.value)}
            />
            {groups.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  setCustomGroup(false);
                  onChange("group", "");
                }}
              >
                Pick existing
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Select
              value={form.group}
              onValueChange={v => onChange("group", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(g => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                setCustomGroup(true);
                onChange("group", "");
              }}
            >
              New group
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="perm-desc">Description</Label>
        <Textarea
          id="perm-desc"
          placeholder="Briefly describe what this permission allows."
          value={form.description}
          disabled={isSubmitting}
          rows={3}
          onChange={e => onChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function PermissionsTab() {
  const queryClient = useQueryClient();

  // ── UI state ──
  const [status, setStatus] = useState<PermissionStatus>("Active"); // ✅ default Active
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  // ── Dialog state ──
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);
  const [form, setForm] = useState<CreatePermissionDto>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // ── Query ──
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: permissionKeys.paged(status, page),
    queryFn: () => permissionService.getAll({ status, sortBy: "name", order: "asc", page, limit }),
    staleTime: 1000 * 60 * 5, // don't refetch for 5 mins
    gcTime: 1000 * 60 * 10, // ✅ keep in memory for 10 mins even when tab switches
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ✅ don't refetch if cache exists on mount
    refetchOnReconnect: false, // ✅ don't refetch on network reconnect
    placeholderData: keepPreviousData, // ✅ keep old data while new page/status loads
    retry: (failureCount, err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 429) return false;
      return failureCount < 2;
    },
  });

  const permissions = useMemo(() => data?.data ?? [], [data?.data]); // ✅ unwrap from PaginatedResponse
  const meta = data?.meta;

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (dto: CreatePermissionDto) => permissionService.create(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: permissionKeys.list("Active") });
      setAddOpen(false);
    },
    onError: err => setFormError(getErrorMessage(err)),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: number) => permissionService.archive(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
      setDeleteTarget(null);
    },
    onError: err => setFormError(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePermissionDto }) =>
      permissionService.update(id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: permissionKeys.list(status) });
      setEditTarget(null);
    },
    onError: err => setFormError(getErrorMessage(err)),
  });

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || archiveMutation.isPending;

  // ── Derived ──
  const groups = useMemo(() => [...new Set(permissions.map(p => p.group))].sort(), [permissions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return permissions.filter(p => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.group.toLowerCase().includes(q);
      const matchGroup = groupFilter === "all" || p.group === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [permissions, search, groupFilter]);

  const groupedFiltered = useMemo(() => {
    const map = new Map<string, Permission[]>();
    filtered.forEach(p => {
      if (!map.has(p.group)) map.set(p.group, []);
      map.get(p.group)!.push(p);
    });
    return map;
  }, [filtered]);

  const isFormValid =
    form.name.trim() !== "" && form.group.trim() !== "" && form.description.trim() !== "";

  // ── Helpers ──
  function setField(field: keyof CreatePermissionDto, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormError("");
    setAddOpen(true);
  }

  function openEdit(p: Permission) {
    setForm({ name: p.name, description: p.description, group: p.group });
    setFormError("");
    setEditTarget(p);
  }

  // ── Render ──
  return (
    <div className="flex flex-col gap-4">
      {/* ── Status Toggle ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Tabs
          value={status}
          onValueChange={v => {
            setStatus(v as PermissionStatus);
            setPage(1);
            setSearch(""); // ✅ reset search on tab switch
            setGroupFilter("all");
          }}
        >
          <TabsList>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* only show Add button on Active tab */}
        {status === "Active" && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add permission
          </Button>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-45 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search permissions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={groupFilter}
          onValueChange={v => {
            setGroupFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All groups</SelectItem>
            {groups.map(g => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none h-9 w-9 ${viewMode === "table" ? "bg-muted" : ""}`}
            onClick={() => setViewMode("table")}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none h-9 w-9 border-l ${viewMode === "cards" ? "bg-muted" : ""}`}
            onClick={() => setViewMode("cards")}
            aria-label="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading permissions...</span>
        </div>
      )}

      {/* ── Load Error ── */}
      {!isLoading && isError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="text-sm font-semibold text-destructive">Failed to load permissions.</p>
            <p className="text-sm text-destructive/80">{getErrorMessage(error)}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* ── Table View ── */}
      {!isLoading && !isError && viewMode === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                {status === "Active" && <TableHead className="w-15" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-10 text-sm"
                  >
                    No {status.toLowerCase()} permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm font-medium">{p.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                        {p.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell max-w-75 truncate">
                      {p.description}
                    </TableCell>
                    {/* ✅ hide actions on Inactive tab — archived items are read-only */}
                    {status === "Active" && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(p)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Cards View ── */}
      {!isLoading && !isError && viewMode === "cards" && (
        <div className="flex flex-col gap-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No {status.toLowerCase()} permissions found.
            </p>
          ) : (
            [...groupedFiltered.entries()].map(([group, perms]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold">{group}</h3>
                  <span className="text-xs text-muted-foreground">({perms.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {perms.map(p => (
                    <Card key={p.id} className="group relative">
                      <CardHeader className="pb-1 pt-4 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="font-mono text-sm font-medium leading-snug">
                            {p.name}
                          </CardTitle>
                          {status === "Active" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(p)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteTarget(p)}
                                >
                                  <ArchiveX className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {p.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && !isError && meta && meta.lastPage > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          {/* ── Count text ── */}
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing <span className="font-medium">{(meta.currentPage - 1) * meta.perPage + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(meta.currentPage * meta.perPage, meta.total)}
            </span>{" "}
            of <span className="font-medium">{meta.total}</span> permissions
          </p>

          {/* ── Buttons ── */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p - 1)}
              disabled={meta.currentPage === 1}
            >
              Previous
            </Button>

            {/* Full page numbers — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: meta.lastPage }, (_, i) => i + 1)
                .filter(p => p === 1 || p === meta.lastPage || Math.abs(p - meta.currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={meta.currentPage === p ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </Button>
                  )
                )}
            </div>

            {/* Page x of y — visible on mobile only */}
            <span className="sm:hidden text-sm text-muted-foreground px-2">
              {meta.currentPage} / {meta.lastPage}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={meta.currentPage === meta.lastPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Add Dialog ── */}
      <Dialog
        open={addOpen}
        onOpenChange={v => {
          if (!v) setAddOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add permission</DialogTitle>
            <DialogDescription>Create a new permission and assign it to a group.</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}
          <PermissionForm
            key={addOpen ? "add" : "closed"}
            form={form}
            groups={groups}
            onChange={setField}
            isSubmitting={isSubmitting}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add permission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={!!editTarget}
        onOpenChange={v => {
          if (!v) setEditTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit permission</DialogTitle>
            <DialogDescription>Update the permission details.</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}
          <PermissionForm
            key={editTarget?.id ?? "edit"}
            form={form}
            groups={groups}
            onChange={setField}
            isSubmitting={isSubmitting}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={() => editTarget && updateMutation.mutate({ id: editTarget.id, dto: form })}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Archive Confirm ── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={v => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive{" "}
              <span className="font-medium text-foreground font-mono">{deleteTarget?.name}</span>?
              It will be moved to the Inactive tab.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              This will remove it from all roles that have it assigned.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && archiveMutation.mutate(deleteTarget.id)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Archiving...
                </>
              ) : (
                "Archive permission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
