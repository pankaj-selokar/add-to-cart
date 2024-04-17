import React from 'react';
import standardHTML from './standard.html';

const StandardComponent = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: standardHTML }} />
  );
};

export default StandardComponent;
