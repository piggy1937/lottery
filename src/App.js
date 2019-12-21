import React from 'react';
import logo from './logo.svg';
import { Switch, Route, withRouter } from 'react-router-dom'
import IndexPage from './page/home'
import DataPage from './page/data/index'
@withRouter
class App extends React.Component{
  render(){
    return (
      <Switch>
          <Route path='/' exact component={IndexPage} />
          <Route path='/data' exact component={DataPage} />
        </Switch>
    );
  }
}

export default App;
