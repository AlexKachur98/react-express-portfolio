/**
 * @file api.d.ts
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Type definitions for API responses and entities.
 *
 * TODO: [TypeScript Migration] This file provides minimal type safety for security-critical code.
 * Priority: HIGH - Consider full TypeScript migration for:
 * - client/src/utils/api.js
 * - client/src/context/AuthContext.jsx
 * - server/middlewares/auth.js
 * - server/utils/jwt.js
 */

// =============================================================================
// API Response Types
// =============================================================================

/** Base error response from API */
export interface ApiError {
    error: string;
    status?: number;
}

/** Generic API response type */
export type ApiResponse<T> = T | ApiError;

/** Check if response is an error */
export function isApiError(response: unknown): response is ApiError;

// =============================================================================
// User and Authentication Types
// =============================================================================

/** User entity from database */
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt?: string;
}

/** Signin request payload */
export interface SigninCredentials {
    email: string;
    password: string;
}

/** Signup request payload */
export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

/** Session validation response */
export interface SessionResponse {
    user: User;
}

/** Auth context state */
export interface AuthState {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
}

// =============================================================================
// Entity Types
// =============================================================================

/** Education/Qualification entity */
export interface Qualification {
    _id: string;
    program: string;
    school: string;
    period: string;
    location: string;
    details: string[];
    createdAt: string;
}

/** Project entity */
export interface Project {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    image?: string;
    github?: string;
    live?: string;
    createdAt: string;
}

/** Service entity */
export interface Service {
    _id: string;
    title: string;
    description: string;
    highlight: boolean;
    createdAt: string;
}

/** Gallery item entity */
export interface GalleryItem {
    _id: string;
    id?: string; // Alias for _id
    title: string;
    tags: string[];
    imageData: string;
    createdAt: string;
}

/** Contact message entity */
export interface Contact {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

/** Guestbook entry entity */
export interface GuestbookEntry {
    _id: string;
    user: string | User;
    message: string;
    emoji: string;
    createdAt: string;
}

// =============================================================================
// API Function Types
// =============================================================================

/** Request options for API client */
export interface RequestOptions extends RequestInit {
    timeout?: number;
}

/** API client functions */
export interface ApiClient {
    // Auth
    signup(user: SignupPayload): Promise<ApiResponse<User>>;
    signin(credentials: SigninCredentials): Promise<ApiResponse<SessionResponse>>;
    signout(): Promise<ApiResponse<{ message: string }>>;
    validateSession(): Promise<ApiResponse<SessionResponse>>;

    // Qualifications
    getQualifications(): Promise<ApiResponse<Qualification[]>>;
    createQualification(data: Partial<Qualification>): Promise<ApiResponse<Qualification>>;
    updateQualification(id: string, data: Partial<Qualification>): Promise<ApiResponse<Qualification>>;
    deleteQualification(id: string): Promise<ApiResponse<Qualification>>;
    deleteAllQualifications(): Promise<ApiResponse<{ message: string }>>;

    // Projects
    getProjects(): Promise<ApiResponse<Project[]>>;
    createProject(data: Partial<Project>): Promise<ApiResponse<Project>>;
    updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>>;
    deleteProject(id: string): Promise<ApiResponse<Project>>;
    deleteAllProjects(): Promise<ApiResponse<{ message: string }>>;

    // Services
    getServices(): Promise<ApiResponse<Service[]>>;
    createService(data: Partial<Service>): Promise<ApiResponse<Service>>;
    updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>>;
    deleteService(id: string): Promise<ApiResponse<Service>>;
    deleteAllServices(): Promise<ApiResponse<{ message: string }>>;

    // Gallery
    getGalleryItems(): Promise<ApiResponse<GalleryItem[]>>;
    createGalleryItem(data: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>>;
    updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>>;
    deleteGalleryItem(id: string): Promise<ApiResponse<GalleryItem>>;
    deleteAllGalleryItems(): Promise<ApiResponse<{ message: string }>>;

    // Contacts
    postContact(contact: Partial<Contact>): Promise<ApiResponse<Contact>>;
    getContacts(): Promise<ApiResponse<Contact[]>>;
    deleteContact(id: string): Promise<ApiResponse<Contact>>;
    deleteAllContacts(): Promise<ApiResponse<{ message: string }>>;

    // Guestbook
    getGuestbookEntries(): Promise<ApiResponse<GuestbookEntry[]>>;
    signGuestbook(entry: Partial<GuestbookEntry>): Promise<ApiResponse<GuestbookEntry>>;
    deleteMyGuestbookEntry(): Promise<ApiResponse<GuestbookEntry>>;
    deleteGuestbookEntry(id: string): Promise<ApiResponse<GuestbookEntry>>;
    deleteAllGuestbookEntries(): Promise<ApiResponse<{ message: string }>>;

    // Users (admin)
    getUsers(): Promise<ApiResponse<User[]>>;
    deleteUser(id: string): Promise<ApiResponse<User>>;
    deleteAllUsers(): Promise<ApiResponse<{ message: string }>>;
}

// =============================================================================
// Security Types
// =============================================================================

/** JWT payload structure */
export interface JwtPayload {
    _id: string;
    email: string;
    role: 'admin' | 'user';
    iat: number;
    exp: number;
}

/** CSRF token cookie/header names */
export interface CsrfConfig {
    cookieName: string;
    headerName: string;
}
