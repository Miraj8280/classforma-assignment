import { BrowserRouter,Routes, Route } from 'react-router-dom';
import WorkflowList from './List';
import WorkflowDesignerPage from './Page';

function App() {
  return (
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<WorkflowList />} exact />
      <Route path="/workflow/:workflow_id" element={<WorkflowDesignerPage />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
