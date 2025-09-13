"use client";

import Auth from "../(auth)/authProvider";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <Auth>
          <div></div>
        </Auth>
      </div>
    </div>
  );
}
