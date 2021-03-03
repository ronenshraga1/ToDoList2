import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { missionUpdated } from './MissionSlice'
let RESPONSE ='cccc';
export const EditPostForm = ({ match }) => {
  const { missionId } = match.params
  const[mission1,SetMission] = useState({missionget:null});
  const[change,SetChange] = useState(0);
  const mission = useSelector((state) =>
    state.missions.find((mission) => mission.id === missionId)
  )
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
        if(jsonResponse.msg==='no access' || jsonResponse.msg === 'didnt found'){
          //do soemthing
          RESPONSE = jsonResponse.msg;
          console.log('fail');
          SetChange(2);
        } else{
          console.log('success');
          console.log(jsonResponse.result[0]);
          RESPONSE = jsonResponse.result;
          SetMission({missionget:jsonResponse.result[0]});
          setTitle(jsonResponse.result[0].title);
          setContent(jsonResponse.result[0].content);
        }
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  const updateMission =async() =>{
    try{
      console.log(title);
      const response = await fetch('https://frozen-ridge-44289.herokuapp.com/updatemission',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
      },
        body:JSON.stringify({id:missionId,title:title,content:content})
      });
      console.log(response.ok);
      if(response.ok){
          console.log('success');
        
      }else{
      throw new Error('request failed');
    }
    }catch(error){
      console.log(error);
    }
  }
  useEffect(()=>{
    getmission();
  },[])
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()
  console.log(mission1);
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const onSavePostClicked = async () => {
    if (title && content) {
      await updateMission();
      history.push(`/missions/${missionId}`)
    }
  }
  console.log(RESPONSE);
  if(localStorage.getItem('authenticated') === 'true'){
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Mission
      </button>
    </section>
  )
  } else{
    return(
      <section>
        <h1>No access</h1>
      </section>
    )
  }
}
