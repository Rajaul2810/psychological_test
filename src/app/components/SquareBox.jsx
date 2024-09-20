import React, { useState, useEffect } from 'react';

const SquareBox = ({ children }) => {
    return (
      <div className="w-[3.8cm] h-[3.8cm] bg-gray-400 flex items-center justify-center">
        {children}
      </div>
    );
  };

export default SquareBox;