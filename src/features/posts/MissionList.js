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
import { WithContext as ReactTags } from 'react-tag-input';


import { TimeAgo } from './TimeAgo'
import { deleteMission,missionAdded } from './MissionSlice'
let  CHANGE =0;
let SUG =true;
let SUG2 =0;
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
const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

let renderedMissions =[];
export const MissionsList = () => {
  const dispatch = useDispatch();
  const[update,SetUpdate] = useState(0);
  const[updatedelete,SetUpdateDelete] = useState(0);
  const[missions1,Setmiss] = useState({missarr:[]});
  const [state, setState] = React.useState({
    checkedG: false,
  });
  const[tag,SeTag] = useState('');
  const[suggestions,SetSuggestions] =useState([
   { id: '#username', text: '#username' },
   { id: '#title', text: '#title' },
   { id: '#content', text: '#content'}
]);
 const[tags,SeTags] =useState([
 ]);
const getSuggestions =() =>{
  let newsugesstions = suggestions.slice();
  console.log(newsugesstions);
  let i=0;
  let newtag =''
  console.log(missions1.missarr.length);
  while(i<missions1.missarr.length){
    console.log(missions1.missarr[i].tag);
    if(missions1.missarr[i].tag !== '' && missions1.missarr[i].tag !== null){
      newtag = {id : '#'+missions1.missarr[i].tag, text:'#'+missions1.missarr[i].tag};
      newsugesstions.push(newtag);
    }
    i++;
  }
  SetSuggestions(newsugesstions);
  console.log(suggestions);

}

   

   const handleDelete=(i)=> {
       SeTags(tags.filter((tag, index) => index !== i));
   }

   const handleAddition=(tag)=> {
    if(tag.text[0] ==='#'){
      let newtag = tag;
      console.log(newtag);
      console.log(tag);
      let ar = tags.slice();
      ar.push(tag);
      SeTags(ar);
    }
   }
   const handleInputChange =(e) =>{
     SeTag(e);
   }

   const handleDrag=(tag, currPos, newPos)=> {
       const newTags = tags.slice();
       newTags.splice(currPos, 1);
       newTags.splice(newPos, 0, tag);

       // re-render
       SeTags(newTags);
   }

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
    SUG = true;
  },[missions])
  useEffect(()=>{
    console.log('work');
    if(SUG || SUG2 <2 || SUG && SUG2 <2){
      console.log('work');
      getSuggestions();
      getSuggestions();
      SUG = false;
      SUG2++;
      }
  },[missions1.missarr])
  useEffect(()=>{
    getmission();
     renderedMissions = missions1.missarr.map((mission) => {
      return (
        <article className="post-excerpt" key={mission.id}>
          <h3>{mission.title}</h3>
          <div>
            <TimeAgo timestamp={mission.date} />
            <p>Tag:{mission.tag}</p>
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
  let orderedMissions = [];
  if(localStorage.getItem('authenticated')){
   orderedMissions = missions1.missarr
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
  if(FILTERON === false){
   renderedMissions = orderedMissions.map((mission) => {
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <p>Tag:{mission.tag}</p>
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
  const filterMissions = orderedMissions.filter(mission => {
    let i=0;
    while(i<tags.length){
      if(tags[i].text==='#username' && mission.username.indexOf(tag) !==-1){
        return mission.username.indexOf(tag) !==-1;
      }else if(tags[i].text==='#title' && mission.title.indexOf(tag) !==-1){
        return mission.title.indexOf(tag) !==-1;
      }else if(tags[i].text==='#content' && mission.content.indexOf(tag) !==-1){
        return mission.content.indexOf(tag) !==-1;
      }else if(tags[i].text!=='#username' && tags[i].text!=='#title' && tags[i].text!=='#content'){
        return mission.tag === tags[i].text.slice(1);
      }
      i++;
    }
    });
  renderedMissions = filterMissions.map((mission) =>{
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <p>Tag:{mission.tag}</p>
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
}
useEffect(()=>{
  const filterMissions = orderedMissions.filter(mission => {
    let i=0;
    while(i<tags.length){
      if(tags[i].text==='#username' && mission.username.indexOf(tag) !==-1){
        return mission.username.indexOf(tag) !==-1;
      }else if(tags[i].text==='#title' && mission.title.indexOf(tag) !==-1){
        return mission.title.indexOf(tag) !==-1;
      }else if(tags[i].text==='#content' && mission.content.indexOf(tag) !==-1){
        return mission.content.indexOf(tag) !==-1;
      }else if(tags[i].text!=='#username' && tags[i].text!=='#title' && tags[i].text!=='#content'){
        return mission.tag === tags[i].text.slice(1);
      }
      i++;
    }
    }
    );
  renderedMissions = filterMissions.map((mission) =>{
    return (
      <article className="post-excerpt" key={mission.id}>
        <h3>{mission.title}</h3>
        <div>
          <p>User:{mission.username}</p>
          <p>Tag:{mission.tag}</p>
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
      console.log('press');
      const filterMissions = orderedMissions.filter(mission => {
        let i=0;
        while(i<tags.length){
          if(tags[i].text==='#username' && mission.username.indexOf(tag) !==-1){
            return mission.username.indexOf(tag) !==-1;
          }else if(tags[i].text==='#title' && mission.title.indexOf(tag) !==-1){
            return mission.title.indexOf(tag) !==-1;
          }else if(tags[i].text==='#content' && mission.content.indexOf(tag) !==-1){
            return mission.content.indexOf(tag) !==-1;
          }else if(tags[i].text!=='#username' && tags[i].text!=='#title' && tags[i].text!=='#content'){
            return mission.tag === tags[i].text.slice(1);
          }
          i++;
        }
        });
      console.log(filterMissions);
      FILTER++;
      FILTERON = true;
      SetUpdate(FILTER);
  
}
const Reset =() =>{
  FILTERON = false;
  FILTER++;
  SetUpdateDelete(FILTER);
  SetSearch('');
}
const filtersugesstions =(textInputValue, possibleSuggestionsArray) =>{
  let lowerCaseQuery = textInputValue.toLowerCase()

  return possibleSuggestionsArray.filter(function(suggestion)  {
      return suggestion.text.includes(lowerCaseQuery);
  })
}

  return (
    <section className="posts-list">
      <h2>Missions</h2>
      <div className="search">
      <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleInputChange={handleInputChange}
                    handleDrag={handleDrag}
                    delimiters={delimiters}
                    handleFilterSuggestions={filtersugesstions}
                    minQueryLength={1}
                    placeholder="filter missions (write # to see more filters)"
                    />
        <button id ="searchbtn"type="button" onClick={searchMissions}>Search</button>
        <button type="button" onClick={Reset}>Reset</button>
        </div>
      {renderedMissions}
    </section>
  )
}
