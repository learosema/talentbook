import { Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/login-page/login-page';
import { MyProfilePage } from '../pages/my-profile-page/my-profile-page';
import { ProfilePage } from '../pages/profile-page/profile-page';
import { SkillPage } from '../pages/skill-page/skill-page';
import { SearchPage } from '../pages/search-page/search-page';
import { SkillDetailsPage } from '../pages/skill-details-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';

import { TeamsPage } from '../pages/teams-page';
import { LogoutPage } from '../pages/logout-page';
import { HomePage } from '../pages/home-page/home-page';

const router = createBrowserRouter([
  {path: '*', Component: MainRoutes }
])

function MainRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile/:name" element={<ProfilePage />} />
      <Route path="/my-profile" element={<MyProfilePage />} />
      <Route path="/my-skills" element={<SkillPage />} />
      <Route path="/skill-details/*" element={<SkillDetailsPage />} />
      <Route path="/teams/*" element={<TeamsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return <RouterProvider router={router} />
}

export default App;
