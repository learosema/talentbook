import { ChangeEvent } from "react";
import { FormField } from "../form-field/form-field";
import { Button, ButtonKind, ButtonType } from "../button/button";
import { TrashcanIcon } from "../svg-icons/svg-icons";
import { RangeInput } from "../range-input/range-input";
import { Link } from "react-router-dom";

export type SkillCardProps = {
  skillName: string;
  skill: number;
  will: number;

  onChangeSkill?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeWill?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDeleteSkill?: () => void;
}

export function SkillCard({
  skillName, 
  skill, 
  onChangeSkill, 
  will,
  onChangeWill,
  onDeleteSkill
}: SkillCardProps) {
  return (<div className="card flow">
    <h3><Link to={`/skill-details/${encodeURIComponent(skillName)}`}>{skillName}</Link></h3>
    
    <FormField label="Skill" htmlFor={`${skillName}_skill`}>
      <RangeInput min={0} max={5} step={1} required value={skill} onChange={onChangeSkill} />
    </FormField>
    
    <FormField label="Will" htmlFor={`${skillName}_will`}>
      <RangeInput min={0} max={5} step={1} required  value={will} onChange={onChangeWill} />
    </FormField>
    {onDeleteSkill && <FormField>
      <Button
        kind={ButtonKind.Danger}
        type={ButtonType.Button}
        onClick={onDeleteSkill}
      >
        <TrashcanIcon width={32} height={32} /> delete skill
      </Button>
    </FormField>}
    
  </div>);
}