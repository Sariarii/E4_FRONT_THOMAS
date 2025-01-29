import { Link, Outlet } from "react-router-dom";
import "./Home.css";
import Button from "@mui/material/Button";

export function Home() {
  return (
    <>
      <h1>Home</h1>
      <Button variant="contained">Hello world</Button>

      <div className="container">
        <aside>
          <nav>
            <ul>
              <li>
                <Link to="/createUser">Create User</Link>
              </li>
              <li>
                <Link to="/createSprint">Create Sprint</Link>
              </li>
              <li>
                <Link to="/getSprints">Demo Sprints from backend </Link>
              </li>
              <li>
                <Link to="/createTask">Create Task</Link>
              </li>
              <li>
                <Link to="/getTasks">Demo Tasks from backend </Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/getProjects">Demo Projects from backend </Link>
              </li>
              <li>
                <Link to="/back">Demo Users from backend </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="container">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
