
import { ReactNode } from "react";
import { useIdentity, useSetLoginStatus } from "../../store/app.context";
import { Layout } from "../layout/layout";

type AppShellProps = { loginRequired?: boolean, children ?: ReactNode };

export function AppShell({children, loginRequired = false}: AppShellProps) {
  useSetLoginStatus(loginRequired);
  const identity = useIdentity();
  return typeof identity !== 'undefined' ? <Layout>{children}</Layout> : <></>;
}

