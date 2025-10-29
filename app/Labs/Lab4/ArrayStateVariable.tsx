import { useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Lab4RootState } from "./store";

interface Todo {
  id: string;
  title: string;
}

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: Lab4RootState) => state.todosReducer);
 const [array, setArray] = useState([1, 2, 3, 4, 5]);
 const addElement = () => {
   setArray([...array, Math.floor(Math.random() * 100)]);
 };
 return (
  <div id="wd-array-state-variables">
   <h2>Array State Variable</h2>
   <button onClick={addElement}>Add Element</button>
   <ul>
   <ListGroup>
        {todos.map((todo: Todo) => (
          <ListGroupItem key={todo.id}>
            {todo.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
   </ul><hr/></div>);}