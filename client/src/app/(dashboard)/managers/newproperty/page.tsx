"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const NewProperty = () => {
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: undefined,
      securityDeposit: undefined,
      applicationFee: undefined,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: [],
      highlights: [],
      beds: undefined,
      baths: undefined,
      squareFeet: undefined,
      propertyType: PropertyTypeEnum.Apartment,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (!authUser?.cognitoInfo?.userId) {
        throw new Error("No manager ID found. Please sign in again.");
      }

      console.log("Form data:", data);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photoUrls") {
          const files = value as File[];
          files.forEach((file: File) => {
            formData.append("photos", file);
          });
        } else if (Array.isArray(value)) {
          // Handle arrays (amenities, highlights)
          if (value.length > 0) {
            formData.append(key, JSON.stringify(value));
          }
        } else if (typeof value === "number") {
          // Ensure numbers are sent as numbers, not strings
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append("managerCognitoId", authUser.cognitoInfo.userId);

      // Debug: Log form data
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await createProperty(formData);
    } catch (error: any) {
      console.error("Error creating property:", error);
      
      // Show user-friendly error message
      const errorMessage = error?.message || "Failed to create property. Please try again.";
      console.error("User-friendly error:", errorMessage);
      
      // The error will also be handled by RTK Query's onQueryStarted
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Listing Title" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Monthly Fee"
                type="number"
                placeholder="Enter monthly rent amount"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                  placeholder="Enter security deposit amount"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                  placeholder="Enter application fee amount"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Listing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                  placeholder="Enter number of bedrooms"
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                  placeholder="Enter number of bathrooms"
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Meters (m²)"
                  type="number"
                  placeholder="Enter square meters"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Pets Allowed 🐾"
                  type="switch"
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included 🚗"
                  type="switch"
                />
              </div>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="multi-select"
                  placeholder="Select amenities"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity.replace(/([A-Z])/g, ' $1').trim(),
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="multi-select"
                  placeholder="Select highlights"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight.replace(/([A-Z])/g, ' $1').trim(),
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Additional Information
              </h2>
              <CustomFormField name="address" label="Address" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="Country" />
            </div>

            <Button
              type="submit"
              className="bg-primary-700 text-white w-full mt-8"
              disabled={isCreating}
            >
              {isCreating ? "Creating Property..." : "Create Property"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
