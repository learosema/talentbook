import { useQuery } from "react-query";
import { AppShell } from "../../components/app-shell/app-shell";
import { SkillApi } from "../../client/skill-api";
import { Link } from "react-router-dom";

export function HomePage() {
  const skillListQuery = useQuery('skills', () => SkillApi.getSkills().send());
  
  return <AppShell loginRequired={true}>
    <article className="flow">
      <h1>Welcome.</h1>
      <p>talentbook is a platform for matching people with potential projects, not only 
        considering their skill level but especially also their willingness working with this technology.</p>
      <h2>Browse by skill</h2>
      <ul role="list" className="grid">
        {(skillListQuery.data || [])
          .map((skill) => (
            <li key={skill.name}>
              <article className="card card--hover | flow block-link">
                <h3>
                  <Link to={'/skill-details/' + encodeURIComponent(skill.name)}>
                    {skill.name}
                  </Link>
                </h3>
                <p>{skill.description}</p>
              </article>
            </li>
          ))
        }
      </ul>
    </article>
  </AppShell>;
}