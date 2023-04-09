import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    fetch('https://64307b10d4518cfb0e50e555.mockapi.io/workflow')
      .then(response => response.json())
      .then(data => setWorkflows(data))
      .catch(error => console.log(error));
  }, []);

  const handleClick = (id, name) => {
    setSelectedWorkflow(name);
    history.push(`/workflow/${id}`);
  }

  return (
    <div style={{ margin: '5%'}}>
      <h1>Workflow List</h1>
    
        <table style={{ borderCollapse: 'separate', borderSpacing: '5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#c4e3cb' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Input Type</th>
              <th style={{ padding: '10px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow, index) => (
              <tr key={workflow.id} style={{ backgroundColor: '#e6f1f6' }}>
                <td style={{ padding: '10px' }}>
                <Link to={`/workflow/${workflow.id}`} onClick={() => handleClick(workflow.id)}>{workflow.name}</Link>
                </td>
                <td style={{ padding: '10px' }}>{workflow.input_type}</td>
                <td style={{ padding: '10px' }}>{workflow.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedWorkflow && <div>Selected Workflow: {selectedWorkflow}</div>}
    </div>
  );
}

export default WorkflowList;

