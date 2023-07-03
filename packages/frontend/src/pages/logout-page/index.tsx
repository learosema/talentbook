import { useEffect } from "react";
import { useAppStore, useIdentity } from "../../store/app.context";
import { useNavigate } from 'react-router-dom';
import { SkillApi } from "../../client/skill-api";
import { Actions } from "../../store/app.actions";
import { useQueryClient } from "react-query";

export function LogoutPage() {
  const identity = useIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { dispatch } = useAppStore();
  
  useEffect(() => {
    const req = SkillApi.logout();
    req.send().finally(() => {
      queryClient.removeQueries();
      dispatch(Actions.setIdentity(null));
    });
  }, [dispatch, queryClient]);

  useEffect(() => {
    if (identity === null) {
      navigate('/');
    }
  }, [identity, navigate]);


  return <></>
}
