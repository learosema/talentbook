import React from 'react';

type SkillTableProps = {
  editMode: boolean;
  children?: React.ReactNode;
};

export const SkillTable: React.FC<SkillTableProps> = ({
  editMode = true,
  children
}) => (
  <table className="skill-table">
    <thead>
      <tr>
        <th colSpan={editMode ? 2 : 1}>Skill</th>
        <th colSpan={2}>Skill level</th>
        <th colSpan={2}>Will level</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
