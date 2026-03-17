import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    name: string;
    description: string;
    price_inr: bigint;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    serviceName: string;
    preferredDate: string;
    preferredTime: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    phone: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getServices(): Promise<Array<Service>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(customerName: string, phone: string, preferredDate: string, preferredTime: string, serviceName: string): Promise<bigint>;
    updateBookingStatus(bookingId: bigint, newStatus: BookingStatus): Promise<void>;
}
