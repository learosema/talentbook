import { Routes, Route } from 'react-router-dom';
import { SkillEditForm } from './skill-edit-form';
import { SkillSearchForm } from './skill-search-form';

export function SkillDetailsPage() {
  return (
    <div className="content-wrapper">
      <Routes>
        <Route index element={<SkillSearchForm />} />
        <Route path="/:skill" element={<SkillEditForm />} />
      </Routes>
    </div>
  );
}
