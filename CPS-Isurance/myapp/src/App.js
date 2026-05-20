import logo from './logo.svg';
import './App.css';
import FormTabs from './components/FormTabs';
import FormTabsCrud from './components/FormTabsCrud';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    
      {/* <FormTabs /> */}
      <FormTabsCrud />
      {/* <Dashboard /> */}
    </div>
  );
}

export default App;
