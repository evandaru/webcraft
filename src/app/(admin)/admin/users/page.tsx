"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Shield, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { type Plan } from "@/lib/plan";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  generateCount: number;
  createdAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { q: search } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json() as { users: AdminUser[]; total: number };
        setUsers(data.users);
        setTotal(data.total);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const updatePlan = async (userId: string, plan: Plan) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        toast.success(`Plan berhasil diubah ke ${plan}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, plan } : u))
        );
      } else {
        toast.error("Gagal mengubah plan");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const updateRole = async (userId: string, role: "admin" | "member") => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success(`Role berhasil diubah ke ${role}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role } : u))
        );
      } else {
        toast.error("Gagal mengubah role");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Users</h1>
        <p className="text-sm text-muted-foreground">{total} total users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Generates</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  {search ? "Tidak ada user yang cocok" : "Tidak ada user"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {user.role === "admin" ? (
                        <ShieldAlert className="h-3 w-3" />
                      ) : (
                        <Shield className="h-3 w-3" />
                      )}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={user.plan as Plan} />
                  </TableCell>
                  <TableCell>{user.generateCount}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt ?? "")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          {updatingId === user.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <MoreVertical className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ubah Plan</DropdownMenuLabel>
                        {(["free", "lite", "premium"] as Plan[]).map((p) => (
                          <DropdownMenuItem
                            key={p}
                            onClick={() => updatePlan(user.id, p)}
                            disabled={user.plan === p}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                            {user.plan === p && " (aktif)"}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Ubah Role</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => updateRole(user.id, "admin")}
                          disabled={user.role === "admin"}
                        >
                          Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateRole(user.id, "member")}
                          disabled={user.role === "member"}
                        >
                          Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}
