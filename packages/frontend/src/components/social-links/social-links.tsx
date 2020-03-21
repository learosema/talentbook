import React from 'react';

import './social-links.scss';

type SocialLinksProps = {
  githubUser?: string;
  twitterHandle?: string;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  githubUser,
  twitterHandle
}) => (
  <p className="social-links">
    {githubUser && (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={'https://github.com/' + githubUser}
      >
        GitHub
      </a>
    )}
    {twitterHandle && (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={'https://twitter.com/' + twitterHandle}
      >
        Twitter
      </a>
    )}
  </p>
);
