import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000;
import { todoSchema, updateTodo, deleteTodo } from "./types";

import Todo from "./db";
import cors from "cors"
app.use(cors())


enum ResponseStatus {
    success = 200,
    NotFound = 404,
    InternalServerError = 500,
    invalidInput = 413,
}
app.post("/newTodo", async(req, res) => {
  const Payload = req.body;

  if (!Payload.title || !Payload.description) {
    res.status(ResponseStatus.invalidInput).json({
      message: "title and description are required"
    });
  }

  const parsePayload = todoSchema.safeParse(Payload);
  if (!parsePayload.success) {
    res.status(ResponseStatus.invalidInput).json({
      message: "Invalid payload"
    });
  }

  const newTodo = await Todo.create({
    title: Payload.title,
    description: Payload.description,
    completed:false
  });

  res.status(ResponseStatus.success).json({
    message: "Todo created successfully",
    newTodo
  });
});

app.get("/todos" , async(req,res)=>{
   
    const todos = await Todo.find();
    res.status(ResponseStatus.success).json({
        message: "Todos fetched successfully", 
        todos
    })
})


app.delete('/deleted' , async(req,res)=>{
    const Payload = req.body
    if(!Payload.id){
        res.status(ResponseStatus.invalidInput).json({
            message: "id is required"
        })
    }

    const parsePayload = deleteTodo.safeParse(Payload);
    if (!parsePayload.success) {
        res.status(ResponseStatus.invalidInput).json({
            message: "Invalid payload"
        })
    }
    await Todo.findByIdAndDelete({_id:req.body.id});
    res.status(ResponseStatus.success).json({
        message: "Todo deleted successfully"
    })
})

app.put("/update" , async(req,res)=>{
    const Payload = req.body
    if(!Payload.id){
        res.status(ResponseStatus.invalidInput).json({
            message: "id is required"
        })
    }
    const parsePayload = updateTodo.safeParse(Payload);
    if (!parsePayload.success) {
        res.status(ResponseStatus.invalidInput).json({
            message: "Invalid payload"
        })
    }
    await Todo.findByIdAndUpdate(req.body.id, { completed: req.body.completed });
     
     res.status(ResponseStatus.success).json({
        message: "Todo updated successfully"
     })

    })

app.get("/bulk", async (req, res) => {
  const sort = req.query.sort || "";

  const todos = await Todo.find({
    $or: [
      { title: { $regex: sort, $options: "i" } },
    ]
  }).select("title description completed");

  res.status(ResponseStatus.success).json({
    todos
  });
});



app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})