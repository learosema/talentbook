import React from 'react';
import { UserSkill, User } from '../api/skill-api';
import { Link } from 'react-router-dom';

type ResultListProps = {
  resultData: UserSkill[];
  // setResultData: Dispatch<SetStateAction<UserSkill[]>>;
}

const groupByUser= (data: UserSkill[]) => {
  const result: Record<string, UserSkill[]> = {}; 
  data.forEach(item => {
    if (!item.userName) {
      return;
    }
    if (!result[item.userName]) {
      result[item.userName] = [];
    }
    result[item.userName].push(item);
  });
  return result;
}


const ResultList: React.FC<ResultListProps> = ({resultData}) => {
  return (<div className="result-list">
    <ul className="result-list__list">
      {Object.entries(groupByUser(resultData)).map(data => {
        const userName = data[0];
        const skills = data[1];
        return (<li className="result-list__item">
          <h4><Link to={'/profile/' + userName}>{userName}</Link></h4>
          <ul className="skill-list">
            {skills.map((skill, index) => <li className="skill-list__item" key={index}>
              {skill.skillName} (skill: {skill.skillLevel} / will {skill.willLevel})
            </li>)}
          </ul>
        </li>);
      })}
        
    </ul>
  </div>)
}

export default ResultList;
