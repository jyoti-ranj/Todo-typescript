import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


interface Todolist {
  _id?:string,
  title:string,
  description:string,
  completed:boolean
}

function Todo(props:Todolist & { onUpdate: (id: string, completed: boolean) => void } & {onDelete : (id:string) =>void}){
    return <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>{props.completed == true ? "Done✅": "Not Done❌"}</p>
      <label>
        Mark as Done
        <input
          type="checkbox"
          checked={props.completed}
          onChange={(e) => props.onUpdate(props._id!, e.target.checked)}
        />
      </label>
      <button onClick={()=>{
        props.onDelete(props._id!)}}>Delete</button>
    </div>
}

function App() {
 const [todo , setTodo] = useState<Todolist[]>([]);
 const [title , setTitle] = useState<string>("");
 const [description , setDescription] = useState<string>("");
 const [search , setSearch] = useState<string>("")
 

 useEffect(()=>{
     axios.get("http://localhost:3000/todos")
     .then((response)=>{
      setTodo(response.data.todos)
     })
 },[])

 useEffect(() => {
  if (search.trim() === "") return; // optional: skip if empty

  axios.get(`http://localhost:3000/bulk?sort=${search}`)
    .then((response) => {
      setTodo(response.data.todos);  // ✅ set the filtered todos
    })
    .catch((err) => {
      console.error("Search failed:", err);
    });
}, [search]);  

useEffect(()=>{

})

useEffect(()=>{
  axios.put(``)
})
  
 const addTodo = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description");
      return;
    }

    try {

      const response = await axios.post("http://localhost:3000/newTodo", {
        title,
        description,
      });

     
      const createdTodo = response.data.newTodo;

     
      setTodo((prevTodos) => [...prevTodos, createdTodo]);

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const updateTodo = async (id: string, completed: boolean) => {
  try {
    await axios.put("http://localhost:3000/update", {
      id,
      completed
    });

    setTodo((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed } : todo
      )
    );
  } catch (error) {
    console.error("Failed to update todo:", error);
  }
};

const deleteTodo = async (id:string) =>{
  try {
    await axios.delete(`http://localhost:3000/deleted`, {
     data: { id }
   });
    setTodo((prevTodos) =>
      prevTodos.filter((todo) => todo._id !== id)
    );
  } catch (error) {
    console.error("Failed to delete todo:", error);
  }
}


  return (
    <>
     <h1>Todo List</h1>
      <input
        type="search"
        placeholder="Search todo..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
     {todo.map((todo)=>{
      return <div key={todo._id}>
        <Todo  title={todo.title} description= {todo.description} completed={todo.completed}  _id={todo._id}
      onUpdate={updateTodo} onDelete={deleteTodo} />
      </div>
     })}
     <input type="text" placeholder='Enter the title here'onChange={(e)=>{
       setTitle(e.target.value)
     }} value={title}/><br/>
     <input type="text" placeholder='Enter the description here' onChange={(e)=>{
      setDescription(e.target.value)
     }} value={description}/><br />
     <button onClick={addTodo}>Add</button>
    </>
  )
}

export default App
