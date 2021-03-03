import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { addSubMission,deleteSubMission } from './MissionSlice'
import { createSlice, nanoid } from '@reduxjs/toolkit'


import { TimeAgo } from './TimeAgo'
import e from 'express'
let COUNT =0;
export const SinglePostPage = ({ match }) => {
  const { missionId } = match.params
  
  const [submission,SetSubMission] = useState('');
  const [submissions,SetSubMissions] = useState({submissionsarray:[],ids:[]});
  const[mission1,SetMIssion] = useState({missionget:null});
  const dispatch = useDispatch();
  const [deletestatus, UpdateDelete] = useState(0);

  
  const getmission =async() =>{
    try{
      console.log(missionId);
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/getspecificmission',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:missionId,auth:localStorage.getItem('authenticated')})
      });
      console.log(response.ok);
      if(response.ok){
        const jsonResponse = await response.json();
        if(jsonResponse.msg==='didnt found'){
          //do soemthing
          console.log('fail');
        } else{
          console.log('success');
          console.log(jsonResponse.result);
          SetMIssion({missionget:jsonResponse.result});
          console.log(mission1.missionget);
        }
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  const getsubmissions =async() =>{
    try{
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/getsubmissions',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:missionId})
      });
      console.log(response.ok);
      if(response.ok){
        const jsonResponse = await response.json();
        console.log(jsonResponse.response);
        SetSubMissions({submissionsarray:jsonResponse.response,ids:jsonResponse.id});
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  const sendSubMission =async(itemid) =>{
    try{
      console.log(missionId);
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/addsubmission',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:missionId,submission:submission,item:itemid})
      });
      console.log(response.ok);
      if(response.ok){
        const jsonResponse = await response.json();
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  const deletesubmission = async (deleteid) =>{
    console.log(deleteid);
    console.log(submissions.submissionsarray);
    try{
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/deletesubmission',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:deleteid})
      });
      console.log(response.ok);
      if(response.ok){
        const jsonResponse = await response.json();
        console.log(jsonResponse.msg);
        if(jsonResponse.msg==='deleted'){
          console.log('success');
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
  let renderSubMissions = [];
  useEffect(()=>{
    getmission();
    getsubmissions();
    console.log(mission1.missionget);
  },[])
  useEffect(()=>{
    getsubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    renderSubMissions = submissions.submissionsarray.map((submis,i=0) =>{
      return(
        <article className="sublist">
        <h4 id={i}>{submis}</h4>
        <button className="delsubutton" id={submissions.ids[i]} onClick={deletesub}>Delete</button>
        {i++}
        </article>
      ); 
      
    })
  },[deletestatus])
  
  const onSubMissionChanged = (e) => SetSubMission(e.target.value);
  const addsubmission = async(event) =>{
    console.log(submission);
    if(event.which === 13 || e.target.id==='addsubbtn'){
      console.log('check');
      await sendSubMission(nanoid());
      COUNT++;
      await getsubmissions();
      console.log('check');
      console.log(submissions.submissionsarray)
       renderSubMissions = submissions.submissionsarray.map((submis,i=0) =>{
        return(
          <article className="sublist">
          <h4 id={i}>{submis}</h4>
          <button className="delsubutton" id={submissions.ids[i]} onClick={deletesub}>Delete</button>
          {i++}
          </article>
        ); 
        
      })
      SetSubMission('');
    }
  }
  const deletesub = async(event) =>{
    await deletesubmission(event.target.id);
    COUNT++
    UpdateDelete(COUNT);
  }
   renderSubMissions = submissions.submissionsarray.map((submis,i=0) =>{
    return(
      <article className="sublist">
      <h4 id={i}>{submis}</h4>
      <br></br>
      <button className="delsubutton" id={submissions.ids[i]} onClick={deletesub}>Delete</button>
      {i++}
      </article>
    ); 
    
  })
  console.log(mission1.missionget);
  if (mission1.missionget === null || mission1.missionget === undefined) {
    console.log('do');
    return (
      <section>
        <h2>mission not found!</h2>
      </section>
    )
  } else{
    console.log(mission1.missionget);
  return (
    <section className="singlemission">
      <article className="post">
        <h2>{mission1.missionget[0].title}</h2>
        <div>
          <TimeAgo timestamp={mission1.missionget[0].date} />
        </div>
        <p className="post-content">{mission1.missionget[0].content}</p>
        <Link to={`/editMission/${mission1.missionget[0].id}`} className="button">
          Edit mission
        </Link>
      </article>
      <article className="submissions">
      <label htmlFor="submission">Add Submission</label>
        <input
          type="text"
          id="submission"
          name="submission"
          placeholder=""
          value={submission}
          onChange={onSubMissionChanged}
          onKeyPress={addsubmission}
        />
        <button id ="addsubbtn"type="button" onClick={addsubmission}>Search</button>
        {renderSubMissions}
      </article>
    </section>
  )}
}

