import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navDelay } from '@utils';
import { Layout, Seo } from '@components';
import { usePrefersReducedMotion } from '@hooks';
import translations from '../translations/translation-en.json';

const StyledMainContainer = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
`;
const StyledTitle = styled.h1`
  color: var(--green);
  font-family: var(--font-mono);
  font-size: clamp(100px, 25vw, 200px);
  line-height: 1;
`;
const StyledSubtitle = styled.h2`
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 400;
`;
const StyledHomeButton = styled(Link)`
  ${({ theme }) => theme.mixins.bigButton};
  margin-top: 40px;
`;

const NotFoundPage = ({ location }) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const contentRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const content = (
    <StyledMainContainer className="fillHeight" ref={contentRef}>
      <StyledTitle>{translations.notFound.title}</StyledTitle>
      <StyledSubtitle>{translations.notFound.subtitle}</StyledSubtitle>
      <StyledHomeButton to="/">{translations.notFound.cta}</StyledHomeButton>
    </StyledMainContainer>
  );

  return (
    <Layout location={location}>
      {prefersReducedMotion ? (
        <>{content}</>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition nodeRef={contentRef} timeout={500} classNames="fadeup">
              {content}
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </Layout>
  );
};

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export const Head = ({ location }) => (
  <Seo location={location} title={translations.notFound.helmet} />
);

export default NotFoundPage;
