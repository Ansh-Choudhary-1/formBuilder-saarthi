import { createContext, useContext, useReducer } from 'react';

const FormContext = createContext();

const initialState = {
  forms: [],
  currentForm: {
    id: '',
    name: '',
    fields: []
  }
};

function formReducer(state, action) {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: [...state.currentForm.fields, action.payload]
        }
      };
    case 'REMOVE_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.filter(field => field.id !== action.payload)
        }
      };
    case 'REORDER_FIELDS':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: action.payload
        }
      };
    case 'SET_CURRENT_FORM':
      return {
        ...state,
        currentForm: action.payload
      };
    case 'SAVE_FORM':
      const existingFormIndex = state.forms.findIndex(form => form.id === action.payload.id);
      const updatedForms = existingFormIndex >= 0
        ? state.forms.map((form, index) => index === existingFormIndex ? action.payload : form)
        : [...state.forms, action.payload];
      return {
        ...state,
        forms: updatedForms
      };
    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}