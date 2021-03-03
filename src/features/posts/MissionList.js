import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


import { TimeAgo } from './TimeAgo'
import { deleteMission,missionAdded } from './MissionSlice'
let  CHANGE =0;
let FILTER =0;
let FILTERON = false;
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  }
})((props) => <Checkbox color="default" {...props} />);
function CheckboxLabels() {
  
}

let renderedMissions =[];
export const MissionsList = () => {
  const dispatch = useDispatch();
  const[update,SetUpdate] = useState(0);
  const[updatedelete,SetUpdateDelete] = useState(0);
  const[missions1,Setmiss] = useState({missarr:[]});
  const [state, setState] = React.useState({
    checkedG: false,
  });
  const[search,SetSearch] = useState('');
  const getmission = async() =>{
    console.log(localStorage.getItem('role'));
    try{
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/getmissions',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body:JSON.stringify({username:localStorage.getItem('username'),role:localStorage.getItem('role'),auth:localStorage.getItem('authenticated')})
      });
      if(response.ok){
        const jsonResponse = await response.json();
        console.log(jsonResponse.js);
        Setmiss({missarr:jsonResponse.js});
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  const deletemission = async (event) =>{
    try{
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/deletemission',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:event.target.id})
      });
      console.log(response.ok);
      if(response.ok){
        const jsonResponse = await response.json();
        if(jsonResponse.msg==='deleted'){
          CHANGE++;
          SetUpdateDelete(CHANGE);
          console.log(updatedelete);
        } else{
          console.log('failed');
        }
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  
  const missions = useSelector((state) => state.missions)
  useEffect(()=>{
    getmission();
  },[missions])

  useEffect(()=>{
    getmission();
     renderedMissions = missions1.missarr.map((mission) => {
      return (
        <article className="post-excerpt" key={mission.id}>
          <h3>{mission.title}</h3>
          <div>
            <TimeAgo timestamp={mission.date} />
          </div>
          <p className="post-content">{mission.content.substring(0, 100)}</p>
  
          <Link to={`/missions/${mission.id}`} className="button muted-button">
            View Post
          </Link>
          <button id={mission.id} onClick={deletemission}>Delete</button>
          <Checkbox
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
        </article>
      )
    })
  },[updatedelete]);
  // Sort posts in reverse chronological order by datetime string
  const orderedMissions = missions1.missarr
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
  if(FILTERON === false){
   renderedMissions = orderedMissions.map((mission) => {
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <TimeAgo timestamp={mission.date} />
        </div>
        <p className="post-content">{mission.content.substring(0, 100)}</p>

        <Link to={`/missions/${mission.id}`} className="button muted-button">
          View Mission
        </Link>
        <button className="delbutton" id={mission.id} onClick={deletemission}>Delete</button>
        <Checkbox
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      </article>
    );
  })
} else{
  const filterMissions = orderedMissions.filter(mission => mission.title.indexOf(search) !==-1 || mission.content.indexOf(search) !==-1 || mission.username.indexOf(search) !==-1);
  renderedMissions = filterMissions.map((mission) =>{
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <TimeAgo timestamp={mission.date} />
        </div>
        <p className="post-content">{mission.content.substring(0, 100)}</p>

        <Link to={`/missions/${mission.id}`} className="button muted-button">
          View Mission
        </Link>
        <button className="delbutton" id={mission.id} onClick={deletemission}>Delete</button>
        <Checkbox
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      </article>
    );
  })
}
useEffect(()=>{
  const filterMissions = orderedMissions.filter(mission => mission.title.indexOf(search) !==-1 || mission.content.indexOf(search) !==-1 || mission.username.indexOf(search) !==-1);
  renderedMissions = filterMissions.map((mission) =>{
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <TimeAgo timestamp={mission.date} />
        </div>
        <p className="post-content">{mission.content.substring(0, 100)}</p>

        <Link to={`/missions/${mission.id}`} className="button muted-button">
          View Mission
        </Link>
        <button className="delbutton" id={mission.id} onClick={deletemission}>Delete</button>
        <Checkbox
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      </article>
    );
    
  })
},[update]);
  const onUpdateSearch = (e) => SetSearch(e.target.value);
  const searchMissions =(e) =>{
    if(e.which === 13){
      console.log('press');
      const filterMissions = orderedMissions.filter(mission => mission.title.indexOf(search) !==-1 || mission.content.indexOf(search) !==-1|| mission.username.indexOf(search) !==-1);
      console.log(filterMissions);
      FILTER++;
      FILTERON = true;
      SetUpdate(FILTER);
  }
}
const Reset =() =>{
  FILTERON = false;
  FILTER++;
  SetUpdateDelete(FILTER);
  SetSearch('');
}
  return (
    <section className="posts-list">
      <h2>Missions</h2>
      <div className="search">
      <input
          type="text"
          id="search"
          name="search"
          placeholder="filter missions by title and content"
          value={search}
          onChange={onUpdateSearch}
          onKeyPress={searchMissions}
        />
        <button type="button" onClick={Reset}>Reset</button>
        </div>
      {renderedMissions}
    </section>
  )
}
