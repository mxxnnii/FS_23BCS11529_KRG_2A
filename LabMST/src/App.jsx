import React, { useState } from "react";
import ProductCard from "./productCard";

const App = () => {
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    if (todo) {
      setTasks([...tasks, todo]);
      setTodo("");
    }
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((curr, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Product Showcase</h1>
      <div className="grid grid-cols-3 gap-8 justify-items-center">
        <ProductCard
          name="Laptop"
          price={120000}
          description="Amazing Laptop"
          instock={true}
        />
        <ProductCard
          name="Human"
          price={200}
          description="Very Efficient"
          instock={false}
        />
        <ProductCard
          name="Phone"
          price={24509}
          description="Good Phone"
          instock={true}
        />
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg">
        <div className="justify-items-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">To-Do List</h2>
          <div className="flex mb-4">
            <input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className="p-2 border rounded-l-md"
              placeholder="Add a new task"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white p-2 rounded-r-md"
            >
              Add
            </button>
          </div>
        </div>
        {tasks.length>0?(
          <ul className="pl-6">
            {tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{task}</span>
                <button
                  onClick={() => handleRemoveTask(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks yet</p>
        )}
      </div>
    </div>
  );
};

export default App;
