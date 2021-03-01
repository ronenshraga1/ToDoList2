import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { missionAdded } from './MissionSlice';
function gethour(){
  const date = new Date();
  const hour = date.getHours();
  console.log(hour);
  if(hour<13){
    alert("בוקר טוב");
    console.log('dadada')
  } else if(hour>=13 && hour<=17){
    alert('צהריים טובים');
  }else{
    alert('ערב טוב');
  }
}


export const AddMissionForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch()
  const users = useSelector((state) => state.users);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);
  useEffect(()=>{
    gethour();
  },[])
  const onSaveMissionClicked = () => {
    if (title && content) {
      dispatch(missionAdded(title, content, localStorage.getItem('username')));
      console.log('hi');
      setTitle('');
      setContent('');
      setUserId('');
    }
  }

  const canSave = Boolean(title) && Boolean(content);
  
  return (
    <section>
      <h2>Add a new Mission</h2>
      <form>
        <label htmlFor="postTitle">Mission Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder=""
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
        <button type="button" onClick={onSaveMissionClicked} disabled={!canSave}>
          Save Mission
        </button>
      </form>
    </section>
  )
}
