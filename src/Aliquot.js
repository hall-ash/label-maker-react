import React, { useState } from "react";
import { Row, Col, Label, FormGroup, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import { FaTrash, FaGripHorizontal, FaPlusCircle } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Aliquot({ data = "aliquot data", id = "1", remove, update, hasAddAliquotButton, addAliquot }) {
  const [editData, setEditData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(edit => !edit);
  };

  const handleChange = evt => {
    setEditData(evt.target.value);
  };

  const handleDelete = () => remove(id);

  const handleUpdate = evt => {
    evt.preventDefault();
    update(id, editData);
    setIsEditing(false);
  };

  // default todo view
  let jsx = (
    <div>
      <li>{data}</li>
      <button onClick={toggleEdit}>Edit</button>
      <button onClick={handleDelete}>X</button>
    </div>
  );

  // todo view when editing
  if (isEditing) {
    jsx = (
      <div>
        <form onSubmit={handleUpdate}>
          <input type="text" value={editData} onChange={handleChange} />
          <button>Update!</button>
        </form>
      </div>
    );
  }

  return (
  <Row className="g-2 mb-1 align-items-center">
    <Col xs="auto" className="d-flex align-items-center justify-content-center">
      <FaGripHorizontal style={{ cursor: 'grab' }}/>
    </Col>
    <Col xs="5">
      <InputGroup>
        <Input
          id="volume"
          name="volume"
          placeholder="volume"
          type="number"
          step="0.001"
          min="0"
          bsSize="sm"
          style={{ flexGrow: 5 }}
        />
         <Input
          id="volumeUnit"
          name="volumeUnit"
          type="select"
          bsSize="sm"
          style={{ flexGrow: 1 }}
        >
          <option>
            mL
          </option>
          <option>
            uL
          </option>
          <option>
            L
          </option>
        </Input>
      </InputGroup>
    </Col>
    <Col xs="4">
      <Input
        id="number"
        name="number"
        placeholder="number"
        type="number"
        step="1"
        min="0"
        bsSize="sm"
      />
    </Col>
    <Col xs="1" className="d-flex align-items-center justify-content-center">
      <FaTrash onClick={remove} style={{ cursor: 'pointer' }} />
    </Col>
    <Col xs="1" className="d-flex align-items-center justify-content-center">
      {hasAddAliquotButton && 
        <FaPlusCircle onClick={addAliquot} style={{ cursor: 'pointer' }} />
      }
    </Col>
  </Row>
  )
}

export default Aliquot;