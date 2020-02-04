import React, {  useState, useEffect, Fragment } from 'react';
import { UserSkill, SkillApi, Identity } from '../api/skill-api';
import { ValidationErrorItem } from '@hapi/joi';
import { ValidationErrors } from './validation-errors';
import { sendToast } from './toaster';
import { ApiException } from '../api/ajax';
import { RangeInput } from './range-input/range-input';

type SkillPageProps = {
  identity: Identity;
}

const objectComparer = (propertyName: string, inversed: boolean = false) => (a: any, b: any) => {
  if (a[propertyName] < b[propertyName]) {
    return inversed ? 1 : -1;
  }
  if (a[propertyName] > b[propertyName]) {
    return inversed ? -1 : 1;
  }
  return 0;
} 

export const SkillPage : React.FC<SkillPageProps> = (props) => {
  
  const [ validationErrors, setValidationErrors ] = useState<ValidationErrorItem[]|null>(null);
  const { identity } = props;
  const [ userSkills, setUserSkills] = useState<UserSkill[]>([]);
  // const [ skills, setSkills] = useState<Skill[]>([]);
  useEffect(() => {
    console.log('effect: userSkills')
    const asyncEffect = async () => {
      try {
        const data = (await SkillApi.getUserSkills(identity.name).send()).sort(objectComparer('skillName'));
        setUserSkills(data);
      } catch (ex) {
        console.error(ex);
      }
    }
    asyncEffect();
  }, [identity]);

  // some fakeData
  const skills = [
    {name: 'jQuery', homepage: 'https://jquery.com', description: 'oldschool framework'},
    {name: 'react', homepage: 'https://reactjs.org', description: 'declarative jsx-based ui framework.'}];


  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (! identity) {
      return;
    }
    try {
      await SkillApi.addUserSkill(identity.name, newSkill).send();
      setUserSkills([...userSkills, newSkill].sort(objectComparer('skillName')));
      sendToast('saved.')
    } catch (ex) {
      console.error(ex);
      if (ex.details && ex.details.details instanceof Array) {
        setValidationErrors(ex.details.details);
      }
      if (ex.name === 'ApiException') {
        const code = (ex as ApiException).code;
        sendToast((ex as ApiException).message);
      }
    }
  }

  const saveUserSkill = async (skillName: string, skillLevel: number, willLevel: number) => {
    if (! identity) {
      return;
    }
    try {
      await SkillApi.updateUserSkill(identity.name, skillName, {skillLevel, willLevel} as UserSkill).send();
      sendToast('saved.');
    } catch (ex) {
      console.error(ex);
      sendToast('update failed: ' + ex.message);
    }
  }

  const [newSkill,setNewSkill] = useState<UserSkill>({
    skillName: '',
    skillLevel: 1,
    willLevel: 2
  });

  return (
    <Fragment>

      <div className="skill-page">
      <datalist id="list">

      </datalist>
      <h3>Configure your skills:</h3>
        
      <form className="form" onSubmit={e => e.preventDefault()}>
        <fieldset className="form__fieldset">
          <legend className="form__fieldset-legend">Your skills</legend>
          <ValidationErrors details={validationErrors}/>
          <table className="skill-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th colSpan={2}>Skill level</th>
                <th colSpan={2}>Will level</th>
              </tr>
            </thead>
            <tbody>
            { 
              userSkills.map((skill, i) => <tr key={skill.skillName}>
                <td className="skill-table__skill-name">{skill.skillName}</td>
                <td className="skill-table__skill">
                  <label htmlFor={'skillSlider' + i}>skill:</label>
                  <RangeInput id={'skillSlider' + i} className="skill-table-range" required min={0} max={5} 
                    step={1} 
                    value={skill.skillLevel}
                    onChange={e => setUserSkills([
                      ...userSkills.slice(0, i), 
                      {...skill, skillLevel: parseInt(e.target.value, 10)},
                      ...userSkills.slice(i + 1)])}
                    onBlur={e => saveUserSkill(skill.skillName, skill.skillLevel, skill.willLevel)} /></td>
                <td className="skill-table__skill-number">
                  {skill.skillLevel}
                </td>
                
                <td className="skill-table__will">
                  <label htmlFor={'willSlider' + i}>will:</label>
                  <RangeInput id={'willSlider' + i} className="form__table-range" 
                    required min={0} max={5} step={1} value={skill.willLevel}
                    onChange={e => setUserSkills([
                      ...userSkills.slice(0, i), 
                      {...skill, willLevel: parseInt(e.target.value, 10)},
                      ...userSkills.slice(i + 1)])}
                   onBlur={e => saveUserSkill(skill.skillName, skill.skillLevel, skill.willLevel)} /></td>
                <td className="skill-table__will-number">
                  {skill.willLevel}
                </td>
              </tr>)
            }
            </tbody>
          </table> 
        </fieldset>
      </form>

      <form className="form" onSubmit={submitHandler}>
          <fieldset className="form__fieldset">
          <legend className="form__fieldset-legend">Add new skill</legend>
            <ValidationErrors details={validationErrors}/>
            <div className="form__buttons">
              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillName">Skill name</label>
                <input className="form__field-input" id="addSkillName" type="text" required
                  placeholder="skill name (eg. jQuery)" 
                  value={newSkill.skillName}
                  onChange={e => setNewSkill({...newSkill, skillName: e.target.value})} />
              </div>
              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillSkillLevel">Skill level</label>
                <RangeInput className="form__field-range" id="addSkillSkillLevel" required min={0} max={5} step={1}
                value={newSkill.skillLevel}
                onChange={e => setNewSkill({...newSkill, skillLevel: parseInt(e.target.value, 10)})}/>
                <output className="form__field-output" htmlFor="addSkillSkillLevel">
                  {newSkill.skillLevel}
                </output>
              </div>

              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillWillLeve">Will level</label>
                <RangeInput className="form__field-range" id="addSkillWillLevel" required min={0} max={5} step={1}
                  value={newSkill.willLevel} 
                  onChange={e => setNewSkill({...newSkill, willLevel: parseInt(e.target.value, 10)})} />
                <output className="form__field-output" htmlFor="addSkillSkillLevel">
                {newSkill.willLevel}
                </output>
              </div>
              <button className="form__button"> save </button>
           </div>
        </fieldset>
      </form>

      </div>
    </Fragment>
  );
};
