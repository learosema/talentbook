import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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
  {path: '/', Component: HomePage},
  {path: '/search', Component: SearchPage},
  {path: '/login', Component: LoginPage},
  {path: '/logout', Component: LogoutPage},
  {path: '/profile/:name', Component: ProfilePage},
  {path: '/my-profile', Component: MyProfilePage},
  {path: '/my-skills', Component: SkillPage},
  {path: '/skill-details/*', Component: SkillDetailsPage},
  {path: '/teams', Component: TeamsPage},
  {path: '*', Component: NotFoundPage }
])

function App() {
  return <RouterProvider router={router} />
}

export default App;
