import React from 'react';
import { useNavigate } from 'react-router-dom';

function PersonaSelection({ setPersona }) {
  const navigate = useNavigate();

  const handleSelect = (persona) => {
    setPersona(persona);
    navigate(`/${persona}`);
  };

  return (
    <div className="persona-selection">
      <h2>Select Your Persona</h2>
      <button onClick={() => handleSelect('supplier')}>Supplier</button>
      <button onClick={() => handleSelect('FreightManagement')}>FreightManagement</button>
      <button onClick={() => handleSelect('company')}>Company</button>
    </div>
  );
}

export default PersonaSelection;
