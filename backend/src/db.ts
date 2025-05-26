import mongoose from "mongoose";


const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose.connect(uri);

const inputSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed:Boolean
});

const Todo = mongoose.model("Todos", inputSchema);

export default Todo;
