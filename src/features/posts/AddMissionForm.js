import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


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
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


export const AddMissionForm = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch()
  const users = useSelector((state) => state.users);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(()=>{
    gethour();
  },[])
  const onSaveMissionClicked = (e) => {
    if (title && content) {
      dispatch(missionAdded(title, content, localStorage.getItem('username')));
      console.log('hi');
      setTitle('');
      setContent('');
      setUserId('');
    } else {
      setOpen(true);
    }
  }
  const onSaveMissionPress = (e) => {
    if (e.key === 'Enter'){
    if (title && content) {
      dispatch(missionAdded(title, content, localStorage.getItem('username')));
      console.log('hi');
      setTitle('');
      setContent('');
      setUserId('');
    } else {
      setOpen(true);
    }
  }
  }

  const canSave = Boolean(title) && Boolean(content);
  const stop =(e) =>{
    if(e.key === 'Enter'){
    e.preventDefault();
    }
  }
  
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
          onKeyPress={stop}
        />
        
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
          onKeyPress={onSaveMissionPress}
        />
        <button type="button" onClick={onSaveMissionClicked} >
          Save Mission
        </button>
      </form>
      <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Check both fields are not empty!
        </Alert>
      </Snackbar>
    </div>
    </section>
  )
}
