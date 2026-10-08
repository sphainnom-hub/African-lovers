import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/matches
export function useMatches() {
  return useQuery({
    queryKey: [api.matches.list.path],
    queryFn: async () => {
      const res = await fetch(api.matches.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch matches");
      return api.matches.list.responses[200].parse(await res.json());
    },
    // Poll for new matches occasionally
    refetchInterval: 10000, 
  });
}

// POST /api/matches (Swipe/Like/Pass)
export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetUserId, action }: { targetUserId: string; action: 'like' | 'pass' }) => {
      const res = await fetch(api.matches.create.path, {
        method: api.matches.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, action }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to process match action");
      return api.matches.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.matches.list.path] });
    },
  });
}
