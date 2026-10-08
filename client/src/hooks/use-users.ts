import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type UpdateProfileRequest } from "@shared/routes";
import { useAuth } from "./use-auth";

// GET /api/users
export function useUsers(filters?: { gender?: string; minAge?: number; maxAge?: number }) {
  // Construct query string manually since filters are optional
  const queryString = filters 
    ? new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, val]) => {
          if (val !== undefined) acc[key] = String(val);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  return useQuery({
    queryKey: [api.users.list.path, filters],
    queryFn: async () => {
      const url = `${api.users.list.path}${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.users.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/users/:id
export function useUser(id: string) {
  return useQuery({
    queryKey: [api.users.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.users.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.users.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// PUT /api/users/:id
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: UpdateProfileRequest) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const validated = api.users.update.input.parse(updates);
      const url = buildUrl(api.users.update.path, { id: user.id });
      
      const res = await fetch(url, {
        method: api.users.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to update profile");
      }
      return api.users.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data);
      queryClient.invalidateQueries({ queryKey: [api.users.get.path, data.id] });
      queryClient.invalidateQueries({ queryKey: [api.users.list.path] });
    },
  });
}
