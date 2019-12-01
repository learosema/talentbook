import React from 'react';

const ResultList: React.FC = () => (<div className="result-list">
  <h3>User search results:</h3>
  <ul className="result-list__list">
    {Array(5).fill(0).map(_ => (<li className="result-list__item">
      <h4 className="result-list__name">Lea Rosema</h4>
      <ul className="skill-list">
        <li className="skill-list__item">jQuery</li>
        <li className="skill-list__item">React</li>
        <li className="skill-list__item">GraphQL</li>
      </ul>
      <p className="result-list__item-desc">I'm a junior frontend developer by day and a creative coder by night.</p>
    </li>))}
  </ul>
    
</div>);

export default ResultList;
