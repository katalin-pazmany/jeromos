"use client";

import { useEffect, useRef } from "react";

// Drop inside any <form>: a hidden honeypot field bots tend to auto-fill,
// plus a submit-timestamp field so the server can reject anything sent
// suspiciously fast. Both are read server-side in lib/spam-guard.ts.
export default function SpamGuardFields() {
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, []);

  return (
    <>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
      />
      <input ref={startedAtRef} type="hidden" name="formStartedAt" defaultValue="" />
    </>
  );
}
