import React, {  useState, useEffect, Fragment } from 'react';
import { UserSkill, SkillApi } from '../api/skill-api';
import { ValidationErrorItem } from '@hapi/joi';
import { ValidationErrors } from './validation-errors';

type SkillPageProps = {

}

export const SkillPage : React.FC<SkillPageProps> = () => {
  
  const [ validationErrors, setValidationErrors ] = useState<ValidationErrorItem[]|null>(null);

  useEffect(() => {
    const asyncEffect = async () => {
      // const allSkills = await SkillApi.getSkills().send()
    }
    asyncEffect();
  }, []);

  // some fakeData
  const skills = [
    {name: 'jQuery', homepage: 'https://jquery.com', description: 'oldschool framework'},
    {name: 'react', homepage: 'https://reactjs.org', description: 'declarative jsx-based ui framework.'}];

  const userSkills = [
    {name: 'react', skillLevel: '2', willLevel: '5'}
  ]

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <Fragment>

      <div className="skill-page">
     
      <h3>Your skills:</h3>
        <form className="form" onSubmit={submitHandler}>
          <fieldset className="form__fieldset">
          <legend className="form__fieldset-legend">Add new skills</legend>
            <ValidationErrors details={validationErrors}/>
            <div className="form__buttons">
              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillName">Skill name</label>
                <input className="form__field-input" id="addSkillName" type="text" required
                  placeholder="skill name (eg. jQuery)"/>
              </div>
              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillSkillLeve">Skill level</label>
                <input className="form__field-input" id="addSkillSkillLeve" type="range" required value="0" min="0" max="5" step="1"/>
              </div>

              <div className="form__field">
                <label className="form__field-label" htmlFor="addSkillWillLeve">Will level</label>
                <input className="form__field-input" id="addSkillWillLeve" type="range" required value="0" min="0" max="5" step="1" />
              </div>



             <button className="form__button"> save </button>
           </div>
         </fieldset>
       </form>

       <form className="form" onSubmit={submitHandler}>
         <fieldset className="form__fieldset">
           <legend className="form__fieldset-legend">Modify skills</legend>
           <ValidationErrors details={validationErrors}/>
           <div className="form__buttons">
             <button className="form__button"> save </button>
           </div>
         </fieldset>
       </form>
      </div>
    </Fragment>
  );
};
