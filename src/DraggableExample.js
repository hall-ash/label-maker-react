import React, { useState } from 'react';
import { FaTrash, FaGripLines } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Assuming you use react-beautiful-dnd for drag and drop

import AliquotInput from './AliquotInput';

const AliquotInputList = () => {
  const [aliquots, setAliquots] = useState([]);

  const handleDelete = (index) => {
    const updatedAliquots = [...aliquots];
    updatedAliquots.splice(index, 1);
    setAliquots(updatedAliquots);
  };

  const handleAddAliquot = () => {
    setAliquots([...aliquots, {}]); // You can initialize with default values if needed
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(aliquots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAliquots(items);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="aliquotList">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {aliquots.map((_, index) => (
                <Draggable key={index} draggableId={`aliquot-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{ ...provided.draggableProps.style, marginBottom: '10px' }}
                    >
                      <FaGripLines {...provided.dragHandleProps} style={{ marginRight: '10px', cursor: 'grab' }} />
                      <AliquotInput onDelete={() => handleDelete(index)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleAddAliquot} style={{ marginTop: '10px' }}>Add Aliquot</button>
    </div>
  );
};

export default AliquotInputList;
