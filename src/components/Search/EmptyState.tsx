import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface EmptyStateProps {
  children: ReactNode;
}

const Container = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
`;

const EmptyState: React.FC<EmptyStateProps> = ({ children }) => {
  return (
    <Container>
      <h3>{children}</h3>
    </Container>
  );
};

export default EmptyState;