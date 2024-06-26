import React, { useEffect, useState, useRef } from "react";
import './imjoking.css';
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);


function App(props) {
  const listHeadingRef = useRef(null);
  const [title, setTitle] = useState("Geo TodoMatic");
  const geoFindMe = () => {
    if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    } else {
    console.log("Locating…");
    navigator.geolocation.getCurrentPosition(success, error);
    
    }
    };
    const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    locateTask(lastInsertedId, {
    latitude: latitude,
    longitude: longitude,
    error: "",
    });
    };
    const error = () => {
    console.log("Unable to retrieve your location");
    };

function usePersistedState(key,defaultValue){
const [state,setState]=useState(()=>JSON.parse(localStorage.getItem(key))||defaultValue);

useEffect(()=>{
  localStorage.setItem(key,JSON.stringify(state));
},[key,state]);

return[state,setState];
}

const [tasks, setTasks] = usePersistedState("tasks", []);
 const [filter, setFilter] = useState("All");
 const [lastInsertedId, setLastInsertedId] = useState("");

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
     
      if (id === task.id) {
      
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
  
      if (id === task.id) {
      
        return { ...task, name: newName };
      }
     
      return task;
    });
    setTasks(editedTaskList);
 
  }

  function locateTask(id, location) {
    const locatedTaskList = tasks.map((task) => {
 
    if (id === task.id) {
    //
    return { ...task, location: location };
    }
    return task;
    });
 
    setTasks(locatedTaskList);
   }

   function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
 
    if (id === task.id) {
   
 
    return { ...task, photo: true };
    }
    return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList); 
   }
  

 
   const taskList = tasks?.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
    id={task.id}
    name={task.name}
    completed={task.completed}
    key={task.id}
    location={task.location} 
    toggleTaskCompleted={toggleTaskCompleted}
    photoedTask={photoedTask} 
    deleteTask={deleteTask}
    editTask={editTask}
    />
   ));
  

  
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = {
    id: id,
    name: name,
    completed: false,
    location: { latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
    }


  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  const [joke, setJoke] = useState('');

  const fetchJoke = async () => {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        if (!response.ok) {
            throw new Error('Failed to fetch Chuck Norris joke');
        }
        const data = await response.json();
        const joke = data.value.replace(/Chuck Norris/g, 'Zhao Yi');
        setJoke(joke);
        setShowJoke(true);
    } catch (error) {
        console.error('Error fetching Chuck Norris joke:', error);
        return null;
    }
};

  const [showJoke, setShowJoke] = useState(false);
  const closeJoke = () => {
    setShowJoke(false);
}



const handleClick = () => {
  if (title === "Geo TodoMatic") {
    setTitle("World DestroyMachine");
  } else {
    setTitle("Geo TodoMatic");
  }
};

  return (
    <div className="todoapp stack-large">
   <h1 onClick={handleClick}>
      {title}
    </h1>
    <Form addTask={addTask} geoFindMe={geoFindMe} />{" "}
    <div className="filters btn-group stack-exception">{filterList}</div>
    <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
    {headingText}
    </h2>
    <ul
    aria-labelledby="list-heading"
    className="todo-list stack-large stack-exception"
    role="list"
    >
    {taskList}
    </ul>
    {title === "World DestroyMachine" && (<div>
  <button id="fetchJokeButton" onClick={fetchJoke}>
    world reset
  </button>

    &nbsp;&nbsp;
    
            {showJoke && (
                <div id="jokeContainer">
                   
                    {joke && <p id="jokeText">{joke}</p>}
                    <button id="fetchJokeButton" onClick={closeJoke}>Close</button> 
                </div>
                
            )}
        </div>)}
    </div>
    
   );

 

  }

export default App;

