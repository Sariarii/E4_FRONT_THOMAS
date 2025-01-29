import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import "./App.css";
import  {GetProjects,CreateProject}  from "./pages/Projects";
import { Home } from "./pages/Home";
import  {GetSprints,CreateSprint}  from "./pages/Sprints";
import { BackUsers, CreateUser } from "./pages/BackUsers";
import {CreateTask,GetTasks} from "./pages/Tasks";
// import { useScore } from './ScoreReducer'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      errorElement:(
        <div id="error-page">
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <Link to="/">Go Home</Link>
      </div>
      ),
      children: [
        {
          path: "/createUser",
          element: <CreateUser/>
        },
        {
          path: "/createSprint",
          element: <CreateSprint/>
        },
        {
          path: "/getSprints",
          element: <GetSprints/>
        },
        {
          path: "/createTask",
          element: <CreateTask/>
        },
        {
          path: "/getTasks",
          element: <GetTasks/>
        },
        {
          path: "/projects",
          element: <CreateProject/>
        },
        {
          path: "/getProjects",
          element: <GetProjects/>
        },
        {
          path: "/back",
          element: <BackUsers/>
        }
      ]
    }
  ]);
  
  return (
      <RouterProvider router={router} >
        
      </RouterProvider>
  );
}

export default App;
