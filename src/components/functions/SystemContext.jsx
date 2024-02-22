/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const SystemContext = createContext();

export const useSystemContext = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystemContext must be used within a ZoomProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [newSystemAdded, setNewSystemAdded] = useState(false);

  const handleAddSystem = () => {
    setNewSystemAdded(true);
  };

  const contextValue = {
    newSystemAdded,
    handleAddSystem,
	};

	SystemProvider.propTypes = {
		children: PropTypes.node,
	};

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  );
};
