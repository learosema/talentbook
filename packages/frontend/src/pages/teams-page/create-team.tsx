import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { TeamType, Team, SkillApi } from '../../client/skill-api';
import { sendToast } from '../../components/toaster/toaster';
import { TeamForm } from './team-form';

export function CreateTeam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialFormState = {
    name: '',
    description: '',
    homepage: '',
    tags: '',
    type: TeamType.PUBLIC,
  };

  const [teamForm, setTeamForm] = useState<Team>(initialFormState);
  const [teamErrors, setTeamErrors] = useState<Partial<Team>>({});

  const createTeamMutation = useMutation(
    () => SkillApi.createTeam(teamForm).send(),
    {
      onSuccess: () => queryClient.invalidateQueries(['my-teams']),
    }
  );

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamForm.name === 'new') {
      setTeamErrors({ name: 'Invalid input' });
      return;
    }
    await createTeamMutation.mutateAsync();
    setTeamForm(initialFormState);
    sendToast('Team created.');
    navigate('/teams');
  };

  return (
    <>
      <h2>Create new Team</h2>
      <TeamForm
        label="Team Details"
        onSubmit={handleCreateTeam}
        teamForm={teamForm}
        setTeamForm={setTeamForm}
        teamErrors={teamErrors}
      />
    </>
  );
}
