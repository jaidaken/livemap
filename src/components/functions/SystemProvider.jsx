import { useState } from "react";
import PropTypes from 'prop-types';
import {SystemContext} from './SystemContext.jsx';

export function SystemProvider({ children }) {
  const [newSystemAdded, setNewSystemAdded] = useState(false);

  const handleAddSystem = () => {
    setNewSystemAdded(prev => !prev);
  };

  return (
    <SystemContext.Provider value={{ newSystemAdded, handleAddSystem }}>
      {children}
    </SystemContext.Provider>
  );
}

SystemProvider.propTypes = {
  children: PropTypes.node,
};
