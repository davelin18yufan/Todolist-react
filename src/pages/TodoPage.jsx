import { editableInputTypes } from '@testing-library/user-event/dist/utils';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTodo, getTodos, patchTodo, deleteTodo } from '../api/todos';
import { useAuth } from 'contexts/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate()
  const { isAuthenticated, currentMember } = useAuth()

  //放在 useEffect 裡的函式會在畫面每次重新渲染後觸發
  useEffect(() => {
    const getTodoAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(
          todos.map(
            //把請求出來的資料再加上IsEdit
            (todo) => ({ ...todo, isEdit: false }),
          ),
        );
      } catch (err) {
        console.log(err);
      }
    };
    getTodoAsync();
  }, []); //第二個參數dependencies空白

  //畫面跳轉前檢查
  useEffect(() => {
   if(!isAuthenticated){
      navigate("/login")
   }
  }, [navigate, isAuthenticated]);


  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        //送出的請求資料用data接
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        return [
          ...prevTodos, //改成用接到的來更改狀態渲染且加上isEdit
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue(''); //清空輸入匡     
    } catch (err) {
      console.error(err);
    }
  };

  //跟上面新增相同
  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        return [
          ...prevTodos, 
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (err) {
      console.error(err);
    }

  };

  //更改isDone算是patch路由
  const handleToggleDone = async (id) => {
    const currentTodo = todos.find(todo => todo.id === id);
    try{
      await patchTodo({
        id,   //這個當前觸發事件的id會被丟進路由的參數
        isDone: !currentTodo.isDone
      })
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    }catch(err){
      console.error(err)
    }
    
  };

  //不會影響資料庫
  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }

        return { ...todo, isEdit: false };
      });
    });
  };

  //更改todo後的儲存
  //不只要更改畫面也要更改資料庫
  const handleSave = async ({ id, title }) => {
    try{
      await patchTodo({ id, title})

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }
  
          return todo;
        });
      });
    }catch(err){
      console.log(err)
    }
  };

  //delete
  const handleDelete = async(id) => {
    try{
      await deleteTodo(id)

      setTodos(
        todos.filter((todo) => {
          return todo.id !== id;
        }),
      );
    }catch(err){
      console.log(err)
    }
  }

  

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name}/>
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onSave={handleSave}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onDelete={handleDelete}
      />
      <Footer todos={todos} />
    </div>
  );
};

export default TodoPage;
