import logo from '../logo.svg';
import './App.css';
import Breadcrumbs  from '@components/Breadcrumb/Breadcrumb';

import {useRoutes} from "react-router-dom";

const Component1 = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Go to app/components for already developed components. 
        </p>
        <p>
          BreadCrumbs Example
          <Breadcrumbs></Breadcrumbs>
        </p>
      </header>
    </div>
  );
};

const Component2 = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
           Bredcrum test after route changed
           <Breadcrumbs></Breadcrumbs>
        </p>
      </header>
    </div>
  );
};

function App() {

  let routes = useRoutes([
    { path: "/", element: <Component1 /> },
    { path: "component2", element: <Component2 /> }
  ]);
  return routes;
}

export default App;
