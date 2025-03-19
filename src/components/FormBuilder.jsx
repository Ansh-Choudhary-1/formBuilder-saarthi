import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm } from '../context/FormContext';
import { v4 as uuidv4 } from 'uuid';

const fieldTypes = [
  { label: 'Text', type: 'text' },
  { label: 'Number', type: 'number' },
  { label: 'Date', type: 'date' },
  { label: 'Checkbox', type: 'checkbox' }
];

export default function FormBuilder() {
  const { state, dispatch } = useForm();
  const [formName, setFormName] = useState('');

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false
    };
    dispatch({ type: 'ADD_FIELD', payload: newField });
  };

  const removeField = (fieldId) => {
    dispatch({ type: 'REMOVE_FIELD', payload: fieldId });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(state.currentForm.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch({ type: 'REORDER_FIELDS', payload: items });
  };

  const saveForm = () => {
    if (!formName) {
      alert('Please enter a form name');
      return;
    }

    const formToSave = {
      id: state.currentForm.id || uuidv4(),
      name: formName,
      fields: state.currentForm.fields
    };

    dispatch({ type: 'SAVE_FORM', payload: formToSave });
    localStorage.setItem('forms', JSON.stringify([...state.forms, formToSave]));
    alert('Form saved successfully!');
  };

  return (
    <div className="form-builder">
      <h2>Form Builder</h2>
      
      <div className="form-name">
        <input
          type="text"
          placeholder="Enter form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>

      <div className="field-types">
        {fieldTypes.map((fieldType) => (
          <button
            key={fieldType.type}
            onClick={() => addField(fieldType.type)}
          >
            Add {fieldType.label}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="form-fields"
            >
              {state.currentForm.fields.map((field, index) => (
                <Draggable
                  key={field.id}
                  draggableId={field.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="form-field"
                    >
                      <div className="field-header">
                        <span>{field.label}</span>
                        <button onClick={() => removeField(field.id)}>×</button>
                      </div>
                      <input
                        type={field.type}
                        placeholder={`Enter ${field.type}`}
                        disabled
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={() => {
                            const updatedFields = state.currentForm.fields.map(f =>
                              f.id === field.id ? { ...f, required: !f.required } : f
                            );
                            dispatch({ type: 'REORDER_FIELDS', payload: updatedFields });
                          }}
                        />
                        Required
                      </label>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={saveForm} className="save-button">
        Save Form
      </button>
    </div>
  );
}