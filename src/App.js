import React from 'react';

import logo from './logo.svg';
import './App.css';
import HomePage from './pages/home';
import FileList from './pages/filelist';

const directory = "./../config";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {action: "home", breadcrumbs: ["home"]};
    this.handleBreadcrumbs = this.handleBreadcrumbs.bind(this);
    this.handlePageAction = this.handlePageAction.bind(this);
  }

  handleBreadcrumbs = (event, action) => {
    const { breadcrumbs } = this.state;
    const breadcrumbsIdx = breadcrumbs.indexOf(action);

    if(breadcrumbsIdx !== breadcrumbs.length-1) {
      console.log("b action ", action);
    }
  }
  handlePageAction = (action) => {
    console.log("App action=",action);
    let breadcrumbs = this.state.breadcrumbs || [];
    breadcrumbs.push(action);

    this.setState({action: action, breadcrumbs: breadcrumbs});
  }

  render = () => {
    return (
      <>
        <div>
          {this.state.breadcrumbs.map((bValue, index) => {
            return (<>
              <span onClick={event => this.handleBreadcrumbs(event, bValue)}> {bValue}  </span> <span>/</span>
              </> ) ;
          })}
        </div>
        {
          (this.state.action === "home" ? <HomePage handlePageAction={this.handlePageAction}/> :
          <FileList handlePageAction={this.handlePageAction} directory={directory}/>
         )
        }
      </>
    );
  }
}

export default App;
