import mongoose from "mongoose";
mongoose.connect("mongodb+srv://admin:po8swOE57abiOCt9@cluster0.799bz.mongodb.net/todoapp-ts");

const inputSchema = new mongoose.Schema({
    title:String,
    description:String,
})
const Todo = mongoose.model("Todos", inputSchema);


export default Todo