
import { ReactNode, useEffect } from "react";
import { useIdentity } from "../../store/app.context";
import { Layout } from "../layout/layout";
import { useNavigate } from "react-router";

type AppShellProps = { loginRequired?: boolean, children ?: ReactNode };

export function AppShell({children, loginRequired = false}: AppShellProps) {
  const identity = useIdentity();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loginRequired && identity === null) {
      navigate('/login');
    }
  }, [loginRequired, identity, navigate]);

  return typeof identity !== 'undefined' ? <Layout>{children}</Layout> : <></>;
}

