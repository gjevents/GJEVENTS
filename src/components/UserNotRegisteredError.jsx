import React from "react";

export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Access unavailable</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account is not registered for this portal yet. Please contact the event team for access.
        </p>
      </div>
    </div>
  );
}
