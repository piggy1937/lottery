import React from 'react';
import logo from './logo.svg';
import { Switch, Route, withRouter } from 'react-router-dom'
import Setting from './page/setting'
@withRouter
class App extends React.Component{
  render(){
    return (
      <Switch>
          <Route path='/' exact component={Setting} />
        </Switch>
    );
  }
}

export default App;
