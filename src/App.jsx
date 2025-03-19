import { FormProvider } from './context/FormContext';
import FormBuilder from './components/FormBuilder';
import FormList from './components/FormList';
import './App.css';

function App() {
  return (
    <FormProvider>
      <div className="app">
        <h1>Dynamic Form Builder</h1>
        <div className="container">
          <FormBuilder />
          <FormList />
        </div>
      </div>
    </FormProvider>
  );
}

export default App;