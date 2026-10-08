import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateMessageRequest } from "@shared/routes";

// GET /api/messages/:userId
export function useMessages(userId: string) {
  return useQuery({
    queryKey: [api.messages.list.path, userId],
    queryFn: async () => {
      if (!userId) return [];
      const url = buildUrl(api.messages.list.path, { userId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!userId,
    refetchInterval: 3000, // Real-time polling
  });
}

// POST /api/messages
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMessageRequest) => {
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      // Optimistically update or invalidate
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path, variables.receiverId] });
    },
  });
}
