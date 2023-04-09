import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, { 
  ReactFlowProvider,
  Controls, 
  MiniMap, 
  Background, 
  addEdge,
  useEdgesState,
  removeElements
  } from 'reactflow';

import 'reactflow/dist/style.css';

function WorkflowDesignerPage() {

  const [modules, setModules] = useState([]);

  const [elements, setElements] = useState([]);

  const { workflow_id } = useParams();
  const [workflowName, setWorkflowName] = useState("");

  const reactFlowWrapper = useRef(null);
  // const [onNodesChange] = useNodesState(elements);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  

  useEffect(() => {
    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/workflow/${workflow_id}`)
      .then(response => response.json())
      .then(data => {
        setWorkflowName(data.name);
        
      })
      .catch(error => console.log(error));
  }, [workflow_id]);

  useEffect(() => {
    fetch(`https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=1&limit=5`)
      .then(response => response.json())
      .then(data =>  {
        setModules(data)
    
           setElements([
          {
            id: '1',
            type: 'input',
            data: { label: <div style={{fontSize: '14px'}}>Input</div> },
            position: { x: 325, y: 50 }
          }
        ]);  

      })
      .catch(error => console.log(error));
  }, [workflow_id]);

  let id = 0;
  const getId = () => `dndnode_${id++}`;

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };


  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);



  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const moduleId = event.dataTransfer.getData('module-id');

      if (typeof type === 'undefined' || !type) {
        return;
      }
      

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // console.log(position)
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setElements((nds) => nds.concat(newNode));

    },
    [reactFlowInstance]
  );

  const onNodeDragStop = (event, node) => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === node.id) {
          el.position = node.position;
        }
        return el;
      })
    );
  };
  
/* 
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const selectedElements = reactFlowInstance.getSelectedElements();
        if (selectedElements.length > 0) {
          onElementsRemove(selectedElements);
        }
      }
    },
    [reactFlowInstance, onElementsRemove]
  );
   */

  const setColor = () => {
    setElements((nds) =>
  nds.map((node) => {
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const hasIncomingEdges = incomingEdges.length > 0;

    const background = hasIncomingEdges ? "#8BC34A" : "#F44336";

    return {
      ...node,
      style: {
        background: background,
        border: "2px solid #DAF5FF",
        borderRadius: "5px",
        padding: "5px",
        marginRight: "110px",
        marginBottom: "20px",
      },
    };
  })
);
  }

  
  
  
  return (
    <div style={{marginLeft: '1%'}}>
      <h3 style={{ border: '2px solid #DAF5FF' , padding: '12px'}}> Workflow name: {workflowName}</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
      
      <div style={{ width: '30%'}}>
    
        <h3 style={{ border: '2px solid #DAF5FF', padding: '15px'}}>Modules</h3>
        {modules.map(module => (
          <div key={module.id} onDragStart={(event) => onDragStart(event, module.name)} draggable style={{ marginRight: '110px', padding: '5px', marginBottom:'20px' ,border: '2px solid #DAF5FF', borderRadius: '5px'}}

          data-id={module.id}

          >
           <span style={{borderRight:'2px solid #DAF5FF', padding: '5px', backgroundColor: 'white'}}>{module.input_type}</span> <span style={{ backgroundColor: '#DAF5FF' }}>{module.name}</span>  <span style={{borderLeft:'2px solid #DAF5FF', padding: '5px', backgroundColor: 'white'}}>{module.output_type}</span>
          </div>
        ))}
      </div>
      <div style={{ width: '70%' }}>
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} style={{ height: 'calc(100vh - 100px)', border: '2px solid #DAF5FF', backgroundColor: '#ECF9FF' }}>
          <ReactFlow 
            nodes={elements}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver} 
            onNodeDragStop={onNodeDragStop}  
            // onKeyDown={onKeyDown}
            setColor={setColor}
          >
            <Background variant="dots" gap={8} size={1}/>
            <MiniMap />
            <Controls />
          </ReactFlow>

        </div>
      </ReactFlowProvider>
      </div>
    </div>
    </div>
  
  );
}


export default WorkflowDesignerPage;

