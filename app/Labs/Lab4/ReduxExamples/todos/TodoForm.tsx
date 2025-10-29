import { Button, FormControl } from "react-bootstrap";
import { ListGroupItem } from "react-bootstrap";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { Lab4RootState } from "../../store";

export default function TodoForm(
) {
  const { todo } = useSelector((state: Lab4RootState) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroupItem>
      <Button onClick={() => dispatch(addTodo(todo))}
              id="wd-add-todo-click"> Add </Button>
      <Button onClick={() => dispatch(updateTodo(todo))}
              id="wd-update-todo-click"> Update </Button>
      <FormControl
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}/>
    </ListGroupItem>
);}
