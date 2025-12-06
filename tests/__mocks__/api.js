/**
 * @file api.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Mock API module for testing.
 */

import { jest } from '@jest/globals';

export const signup = jest.fn();
export const signin = jest.fn();
export const signout = jest.fn();
export const validateSession = jest.fn();

export const postContact = jest.fn();
export const getContacts = jest.fn();
export const deleteContact = jest.fn();
export const deleteAllContacts = jest.fn();

export const getQualifications = jest.fn();
export const createQualification = jest.fn();
export const updateQualification = jest.fn();
export const deleteQualification = jest.fn();
export const deleteAllQualifications = jest.fn();

export const getProjects = jest.fn();
export const createProject = jest.fn();
export const updateProject = jest.fn();
export const deleteProject = jest.fn();
export const deleteAllProjects = jest.fn();

export const getServices = jest.fn();
export const createService = jest.fn();
export const updateService = jest.fn();
export const deleteService = jest.fn();
export const deleteAllServices = jest.fn();

export const getGalleryItems = jest.fn();
export const getGallery = jest.fn();
export const createGalleryItem = jest.fn();
export const updateGalleryItem = jest.fn();
export const deleteGalleryItem = jest.fn();
export const deleteAllGalleryItems = jest.fn();

export const getGuestbookEntries = jest.fn();
export const signGuestbook = jest.fn();
export const deleteMyGuestbookEntry = jest.fn();
export const deleteGuestbookEntry = jest.fn();
export const deleteAllGuestbookEntries = jest.fn();

export const getUsers = jest.fn();
export const deleteUser = jest.fn();
export const deleteAllUsers = jest.fn();
