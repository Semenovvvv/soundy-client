import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ isActive: boolean }>`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: ${({ isActive }) => (isActive ? '#1db954' : '#262626')};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1db954;
  }
`;

interface CategoryButtonsProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ categories, onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleClick = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };

  return (
    <Container>
      {categories.map((category) => (
        <Button
          key={category}
          isActive={activeCategory === category}
          onClick={() => handleClick(category)}
        >
          {category}
        </Button>
      ))}
    </Container>
  );
};

export default CategoryButtons;