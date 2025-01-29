import { Link, Outlet, useLocation } from "react-router-dom";
import "./Home.css";
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export function BasicMenu() {
  const [value, setValue] = React.useState('0');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Page d'acceuil" value="0" />
            <Tab label="utilisateurs" value="1" />
            <Tab label="Projets" value="2" />
            <Tab label="Taches" value="3" />
            <Tab label="Sprints" value="4" />
          </TabList>
        </Box>
        <TabPanel value="0">rien pour l'instant</TabPanel>
        <TabPanel value="1">
          <li><Link to="/createUser">Creer un utilisateur</Link></li>
          <li><Link to="/back">Liste des utilisateurs</Link></li>
          <div>
            <Outlet />
          </div>
        </TabPanel>
        <TabPanel value="2">
          <li><Link to="/projects">Creer un projet</Link></li>
          <li><Link to="/getProjects">Liste des projets</Link></li>
          <div>
            <Outlet />
          </div>
        </TabPanel>
        <TabPanel value="3">
          <li><Link to="/createTask">Creer une tâche</Link></li>
          <li><Link to="/getTasks">Liste des tâches</Link></li>
          <div>
            <Outlet />
          </div>
        </TabPanel>
        <TabPanel value="4">
          <li><Link to="/createSprint">Creer un sprint</Link></li>
          <li><Link to="/getSprints">Liste des sprints</Link></li>
          <div>
            <Outlet />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
