import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import { missionAdded } from './MissionSlice';
import { Link } from 'react-router-dom';
function gethour(){
  const date = new Date();
  const hour = date.getHours();
  console.log(hour);
  if(hour<13){
    return "Good Morning";
    console.log('dadada')
  } else if(hour>=13 && hour<=17){
    return 'Good afternoon';
  }else{
    return'Good evening';
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
  const history = useHistory()
  const [open, setOpen] = React.useState(false);
  const [hello, setHello] = React.useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  const dispatch = useDispatch()
  const users = useSelector((state) => state.users);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onTagChanged = (e) => setTag(e.target.value);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setHello(false);
  };
  useEffect(()=>{
    setHello(true);
  },[])
  const onSaveMissionClicked = (e) => {
    if (title !== '' && content !=='') {
      dispatch(missionAdded(title, content, localStorage.getItem('username'),tag));
      console.log('hi');
      setTitle('');
      setContent('');
      setTag('');
    } else {
      setOpen(true);
    }
  }
  const onSaveMissionPress = (e) => {
    if (e.key === 'Enter'){
    if (title !== '' && Boolean(content)) {
      dispatch(missionAdded(title, content, localStorage.getItem('username'),tag));
      console.log('hi');
      setTitle('');
      setContent('');
      setTag('');
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
  const logout=()=>{
    localStorage.setItem('username','');
    localStorage.setItem('password','');
    localStorage.setItem('authenticated','false');
    localStorage.setItem('role','');
    history.push('/login');
  }
  
  return (
    <section>
     <div className="logout">
      <h2>Add a new Mission</h2>
      <button className="btn" onClick={logout}>Logout</button>
      </div>
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
        <label htmlFor="tag">Tag</label>
        <input
          type="text"
          id="tag"
          name="tag"
          placeholder=""
          value={tag}
          onChange={onTagChanged}
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
      <Snackbar open={hello} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
          {gethour()+' '+localStorage.getItem('username')}
        </Alert>
      </Snackbar>
    </div>
    </section>
  )
}
