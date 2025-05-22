import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
      <h3>Ничего не найдено</h3>
      <p>Попробуйте изменить запрос.</p>
    </div>
  );
};

export default EmptyState;