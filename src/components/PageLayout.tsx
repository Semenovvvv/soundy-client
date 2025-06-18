import React from 'react';
import styled from 'styled-components';

export const PageLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0rem 0rem;
  }
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <PageLayoutContainer>
      {children}
    </PageLayoutContainer>
  );
};

export default PageLayout; 