import { useEffect } from 'react';
import { useForm } from '../context/FormContext';

export default function FormList() {
  const { state, dispatch } = useForm();

  useEffect(() => {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      const forms = JSON.parse(savedForms);
      forms.forEach(form => {
        dispatch({ type: 'SAVE_FORM', payload: form });
      });
    }
  }, []);

  const loadForm = (form) => {
    dispatch({ type: 'SET_CURRENT_FORM', payload: form });
  };

  return (
    <div className="form-list">
      <h3>Saved Forms</h3>
      {state.forms.map(form => (
        <div key={form.id} className="saved-form">
          <span>{form.name}</span>
          <button onClick={() => loadForm(form)}>Edit</button>
        </div>
      ))}
    </div>
  );
}