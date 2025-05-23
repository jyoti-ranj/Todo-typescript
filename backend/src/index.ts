import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express()
app.use(express.json())
const port = process.env.PORT || 3000;
import todoSchema from "./types";
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
    description: Payload.description
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





















app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
})