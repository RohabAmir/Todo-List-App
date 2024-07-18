import React, { useState, useEffect } from "react";
import "./App.css";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [alltodos, setAllTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  const handleAddTodo = () => {
    if (newTitle.trim() === "" || newDescription.trim() === "") {
      return;
    }
  
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
  
    let updatedTodoArray = [...alltodos];
    updatedTodoArray.push(newTodoItem);
    setAllTodos(updatedTodoArray);
    setNewTitle("");
    setNewDescription("");
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArray));
  };
  

  const handleDeleteTodo = (index)=>{
    let reducedTodo = [...alltodos];
    reducedTodo.splice(index,1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  }

  const handleDeleteCompletedTodo = (index)=>{
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index,1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  }

  const handleCompletedTodo = (index)=>{
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    let completedOn = dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ':' + s;

    let filteredItems={
      ...alltodos[index],
      completedOn: completedOn,

    }
    let updatedCompletedArray = [...completedTodos];
    updatedCompletedArray.push(filteredItems);
    setCompletedTodos(updatedCompletedArray);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArray));
  }

  const handleEditTodo = (index,item)=>{
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  }
  
  const handleUpdateTitle =(value)=>{
    setCurrentEditedItem((prev)=>{
      return{...prev,title:value}
    })
  }
  const handleUpdateDescription =(value)=>{
    setCurrentEditedItem((prev)=>{
      return{...prev,description:value}
    })
  }

  const handleUpdateTodo=()=>{
    let newTodo = [...alltodos];
    newTodo[currentEdit] = currentEditedItem;
    setAllTodos(newTodo);
    setCurrentEdit("");
  }

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));

    if(savedTodo){
      setAllTodos(savedTodo);
    }
    if(savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
  }, [])
  

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Desciption</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primary-btn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondary-btn ${
              isCompleteScreen === false && "active"
            }`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondary-btn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {isCompleteScreen === false &&
            alltodos.map((item, index) => {
              if(currentEdit===index){
                return(
                  <div className="edit-wrapper" key={index}>
                    <input 
                      value={currentEditedItem.title} 
                      placeholder="Updated Title" 
                      onChange={(e)=>handleUpdateTitle(e.target.value)}/>
                    <textarea
                      rows={4}
                      value={currentEditedItem.description}
                      placeholder="Updated Description"
                      onChange={(e)=>handleUpdateDescription(e.target.value)}
                     />
                      <button
                        type="button"
                        onClick={handleUpdateTodo}
                        className="primary-btn"
                      >
                        Update
                      </button>
                  </div>
                )
              }
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <BsCheckLg
                      onClick={() => handleCompletedTodo(index)}
                      className="check-icon"
                      title="Complete?"
                    />
                    <AiOutlineEdit
                      onClick={() => handleEditTodo(index,item)}
                      className="check-icon"
                      title="Edit?"
                    />
                      <AiOutlineDelete
                      onClick={() => handleDeleteTodo(index)}
                      className="icon"
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p className="todo-description"><small><i>Completed on: {item.completedOn}</i></small></p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      onClick={() => handleDeleteCompletedTodo(index)}
                      className="icon"
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
