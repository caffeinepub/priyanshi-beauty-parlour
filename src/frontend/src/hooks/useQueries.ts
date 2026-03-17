import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, BookingStatus, Service } from "../backend.d";
import { useActor } from "./useActor";

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitBooking() {
  const { actor } = useActor();
  return useMutation<
    bigint,
    Error,
    {
      customerName: string;
      phone: string;
      preferredDate: string;
      preferredTime: string;
      serviceName: string;
    }
  >({
    mutationFn: async ({
      customerName,
      phone,
      preferredDate,
      preferredTime,
      serviceName,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitBooking(
        customerName,
        phone,
        preferredDate,
        preferredTime,
        serviceName,
      );
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { bookingId: bigint; newStatus: BookingStatus }
  >({
    mutationFn: async ({ bookingId, newStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
