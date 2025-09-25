"use client";

import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";

import { PageLoader } from "@web/components/common/PageLoader";

export const SessionLoader = ({ children }: PropsWithChildren) => {
  const { status } = useSession();

  if (status === "loading") {
    return <PageLoader />;
  }

  return children;
};
