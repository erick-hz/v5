import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Seo, Hero, About, Jobs, Featured, Projects, Contact } from '@components';

export const Head = ({ location }) => <Seo location={location} />;

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Jobs />
      <Featured />
      <Projects />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
