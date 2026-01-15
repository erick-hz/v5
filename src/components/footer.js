import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

// Constants
const GITHUB_USERNAME = 'erick-hz';
const GITHUB_REPO = 'v5';
const GITHUB_API_BASE = 'https://api.github.com';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  height: auto;
  min-height: 70px;
  padding: 15px;
  text-align: center;
`;

const StyledSocialLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 10px;
    color: var(--light-slate);
  }

  ul {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    a {
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const StyledCredit = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  line-height: 1;

  a {
    padding: 10px;
  }

  .github-stats {
    margin-top: 10px;

    & > span {
      display: inline-flex;
      align-items: center;
      margin: 0 7px;
    }
    svg {
      display: inline-block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
  }
`;

// Component for individual stat
const GitHubStat = ({ icon, value, label }) => (
  <span aria-label={`${label}: ${value}`}>
    <Icon name={icon} />
    <span>{value.toLocaleString()}</span>
  </span>
);

GitHubStat.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

// Validate GitHub API response data
const isValidGitHubData = (stars, forks, followers, repos) =>
  typeof stars === 'number' &&
  typeof forks === 'number' &&
  typeof followers === 'number' &&
  typeof repos === 'number' &&
  stars >= 0 &&
  forks >= 0 &&
  followers >= 0 &&
  repos >= 0;

const Footer = () => {
  const [githubInfo, setGitHubInfo] = useState({
    stars: 0,
    forks: 0,
    followers: 0,
    repos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchGitHubInfo = async () => {
      try {
        setIsLoading(true);

        const [repoResponse, userResponse] = await Promise.all([
          fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`, {
            signal: abortController.signal,
          }),
          fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
            signal: abortController.signal,
          }),
        ]);

        if (!repoResponse.ok || !userResponse.ok) {
          throw new Error(`GitHub API error: ${repoResponse.status} / ${userResponse.status}`);
        }

        const [repoData, userData] = await Promise.all([repoResponse.json(), userResponse.json()]);

        const { stargazers_count, forks_count } = repoData;
        const { followers, public_repos } = userData;

        if (isValidGitHubData(stargazers_count, forks_count, followers, public_repos)) {
          setGitHubInfo({
            stars: stargazers_count,
            forks: forks_count,
            followers,
            repos: public_repos,
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching GitHub stats:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubInfo();

    return () => {
      abortController.abort();
    };
  }, []);

  const hasGitHubStats = githubInfo.stars > 0 || githubInfo.followers > 0;

  return (
    <StyledFooter>
      <StyledSocialLinks>
        <ul>
          {socialMedia &&
            socialMedia.map(({ name, url }, i) => (
              <li key={i}>
                <a href={url} aria-label={name}>
                  <Icon name={name} />
                </a>
              </li>
            ))}
        </ul>
      </StyledSocialLinks>

      <StyledCredit tabIndex="-1">
        <a href={`https://github.com/${GITHUB_USERNAME}`} aria-label="GitHub Profile">
          <div>Designed &amp; Built by Erick Hernandez</div>

          {!isLoading && hasGitHubStats && (
            <div className="github-stats">
              <GitHubStat icon="Star" value={githubInfo.stars} label="Stars" />
              <GitHubStat icon="Fork" value={githubInfo.forks} label="Forks" />
              <GitHubStat icon="GitHub" value={githubInfo.followers} label="Followers" />
              <GitHubStat icon="Folder" value={githubInfo.repos} label="Public Repos" />
            </div>
          )}
        </a>
      </StyledCredit>
    </StyledFooter>
  );
};

export default Footer;
