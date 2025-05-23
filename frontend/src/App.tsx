import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


interface Todolist {
  _id?:string,
  title:string,
  description:string
}

function Todo(props:Todolist){
    return <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </div>
}

function App() {
 const [todo , setTodo] = useState<Todolist[]>([]);
 const [title , setTitle] = useState<string>("");
 const [description , setDescription] = useState<string>("");

 useEffect(()=>{
     axios.get("http://localhost:3000/todos")
     .then((response)=>{
      setTodo(response.data.todos)
     })
 },[])
  
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

  return (
    <>
     <h1>Todo List</h1>
     {todo.map((todo)=>{
      return <div key={todo._id}>
        <Todo  title={todo.title} description= {todo.description} />
      </div>
     })}
     <input type="text" placeholder='Enter the title here'onChange={(e)=>{
       setTitle(e.target.value)
     }} value={title}/><br />
     <input type="text" placeholder='Enter the description here' onChange={(e)=>{
      setDescription(e.target.value)
     }} value={description}/><br />
     <button onClick={addTodo}>Add</button>
    </>
  )
}

export default App
