import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'

import { MissionsList } from './features/posts/MissionList'
import { AddMissionForm } from './features/posts/AddMissionForm'
import { EditPostForm } from './features/posts/EditMissionForm'
import { SinglePostPage } from './features/posts/SingleMissionPage'
import {Login} from './features/posts/Login';
import { Register } from './features/posts/Register';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
        <Route
            exact
            path="/"
            component={Login}
          />
           <Route
            exact
            path="/register"
            component={Register}
          />
          <Route
            exact
            path="/missions"
            render={() => (
              <React.Fragment>
                <AddMissionForm />
                <MissionsList />
              </React.Fragment>
            )}
          />
          <Route exact path="/missions/:missionId" component={SinglePostPage} />
          <Route exact path="/editMission/:missionId" component={EditPostForm} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App

