import TodoItem from './TodoItem';

const TodoCollection = ({
  todos, 
  onSave, 
  onDelete, 
  onToggleDown, 
  onChangeMode}) => {
  return (
    <div>
     {todos.map(todo => <TodoItem todo={todo} key={todo.id}/>)}
    </div>
  );
};

export default TodoCollection;
