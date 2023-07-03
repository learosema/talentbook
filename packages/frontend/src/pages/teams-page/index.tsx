import { Routes, Route, Link } from 'react-router-dom';
import { CreateTeam } from './create-team';
import { MyTeams } from './my-teams';
import { SearchTeams } from './search-teams';
import { TeamDetailsPage } from './team-details';
import { AppShell } from '../../components/app-shell/app-shell';

const TeamNav: React.FC = () => (
  <nav className="teams-page__nav" aria-label="Teams sub-navigation">
    <ul>
      <li>
        <Link className="button" to="/teams">
          My Teams
        </Link>
      </li>
      <li>
        <Link className="button" to="/teams/search">
          Search Teams
        </Link>
      </li>
      <li>
        <Link className="button" to="/teams/new">
          Create New Team
        </Link>
      </li>
    </ul>
  </nav>
);

export function TeamsPage() {
  return (
    <AppShell>
      <TeamNav />
      <Routes>
        <Route index element={<MyTeams />} />
        <Route path="/new" element={<CreateTeam />} />
        <Route path="/search" element={<SearchTeams />} />
        <Route path="/:team" element={<TeamDetailsPage />} />
      </Routes>
    </AppShell>
  );
}
