import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  
];
let COUNT =0;
async function sendmission(payload){
  console.log(payload.date);
  try{
    const response = await fetch('https://frozen-ridge-44289.herokuapp.com/addmission',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body:JSON.stringify({id:payload.id,date:payload.date,title:payload.title,content:payload.content,user:payload.username})
    });
    if(response.ok){
      const jsonResponse = await response.json();
      console.log(jsonResponse.js);
    }else{
    throw new Error('request failed');
  }
  }catch(error){
    console.log(error);
  }
}

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    missionAdded: {
        reducer(state, action) {
        sendmission(action.payload);
        state.push(action.payload);
        console.log(state);
      },
       prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title:title,
            content:content,
            username: userId,
            submissions:['1','2']
          },
        }
      },
    },
    
    missionUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    deleteMission(state,action){
      const {id} = action.payload;
      console.log(state);
      console.log(id);
      const index = state.indexOf((post) => post.id === id)
      state.splice(index,1);
      
    },
    addSubMission(state,action){
      const{ subs,missionId } = action.payload;
      console.log(subs);
      const addmission = state.find((mission) =>mission.id === missionId);
      const sub = addmission.submissions.slice();
      sub.push(subs);
      console.log(sub);
      addmission.submissions = sub;
    },
    deleteSubMission(state,action){
      const{ subs,missionId,id} = action.payload;
      console.log(subs);
      const addmission = state.find((mission) =>mission.id === missionId);
      const sub = addmission.submissions.slice();
      sub.splice(parseInt(id),1);
      addmission.submissions = sub;
    },
  },
})

export const { missionAdded, missionUpdated ,deleteMission, addSubMission,deleteSubMission} = missionsSlice.actions

export default missionsSlice.reducer
