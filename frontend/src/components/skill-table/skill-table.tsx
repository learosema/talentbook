import React from 'react';

import './skill-table.scss';

export const SkillTable: React.FC = ({ children }) => (
  <table className="skill-table">
    <thead>
      <tr>
        <th colSpan={2}>Skill</th>
        <th colSpan={2}>Skill level</th>
        <th colSpan={2}>Will level</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
