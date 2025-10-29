import { ListGroup } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import { Lab4RootState } from "../../store";

interface Todo {
  id: string;
  title: string;
}

export default function TodoList() {
    const { todos } = useSelector((state: Lab4RootState) => state.todosReducer);
  return (
    <div>
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo}/>
        ))}
      </ListGroup><hr/>
</div>);}        