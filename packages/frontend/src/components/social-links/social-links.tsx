import React from 'react';

type SocialLinksProps = {
  githubUser?: string;
  twitterHandle?: string;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  githubUser,
  twitterHandle
}) => (
  <ul className="tag-list">
    {githubUser && (
      <li className="tag-list__item">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={'https://github.com/' + githubUser}
        >
          GitHub
        </a>
      </li>

    )}
    {twitterHandle && (
      <li className="tag-list__item">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={'https://twitter.com/' + twitterHandle}
        >
          Twitter
        </a>
      </li>
    )}
  </ul>
);
