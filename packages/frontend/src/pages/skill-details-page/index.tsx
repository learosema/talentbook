import { Routes, Route } from 'react-router-dom';
import { SkillEditForm } from './skill-edit-form';
import { SkillSearchForm } from './skill-search-form';
import { AppShell } from '../../components/app-shell/app-shell';

export function SkillDetailsPage() {
  return (
    <AppShell loginRequired={true}>
      <Routes>
        <Route index element={<SkillSearchForm />} />
        <Route path="/:skill" element={<SkillEditForm />} />
      </Routes>
    </AppShell>
  );
}
