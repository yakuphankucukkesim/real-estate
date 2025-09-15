import * as z from "zod";
import { PropertyTypeEnum } from "@/lib/constants";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.coerce.number().positive("Price must be positive").min(0).int(),
  securityDeposit: z.coerce.number().positive("Security deposit must be positive").min(0).int(),
  applicationFee: z.coerce.number().positive("Application fee must be positive").min(0).int(),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  highlights: z.array(z.string()).min(1, "At least one highlight is required"),
  beds: z.coerce.number().positive("Number of beds must be positive").min(1, "At least 1 bed required").max(10, "Maximum 10 beds allowed").int(),
  baths: z.coerce.number().positive("Number of baths must be positive").min(1, "At least 1 bath required").max(10, "Maximum 10 baths allowed").int(),
  squareFeet: z.coerce.number().int("Square meters must be a whole number").positive("Square meters must be positive"),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
