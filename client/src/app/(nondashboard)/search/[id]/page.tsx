"use client";

import { useGetAuthUserQuery } from "@/state/api";
import { useParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";

const ImagePreviews = dynamic(() => import("./ImagePreviews"), {
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
});

const PropertyOverview = dynamic(() => import("./PropertyOverview"), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-4" />
});

const PropertyDetails = dynamic(() => import("./PropertyDetails"), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-4" />
});

const PropertyLocation = dynamic(() => import("./PropertyLocation"), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-4" />
});

const ContactWidget = dynamic(() => import("./ContactWidget"), {
  loading: () => <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
});

const ApplicationModal = dynamic(() => import("./ApplicationModal"), {
  ssr: false
});

const SingleListingContent = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

const SingleListing = () => {
  return (
    <Suspense fallback={<div className="h-screen bg-gray-200 animate-pulse" />}>
      <SingleListingContent />
    </Suspense>
  );
};

export default SingleListing;