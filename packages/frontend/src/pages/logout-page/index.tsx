import { useEffect } from "react";

import { SkillApi } from "../../client/skill-api";
import { useQueryClient } from "react-query";
import { AppShell } from "../../components/app-shell/app-shell";

export function LogoutPage() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    let timer = window.setTimeout(() => {
      timer = NaN;
      const req = SkillApi.logout();
      req.send().finally(() => {
        queryClient.invalidateQueries();
      });
    }, 1000);
    
    return () => {
      if (!Number.isNaN(timer)) {
        window.clearTimeout(timer);
      }
    }
  }, [queryClient]);

  return <AppShell loginRequired={true}>
    <h1>Logging out</h1>
    <p>Bye. 👋</p>
  </AppShell>
}
