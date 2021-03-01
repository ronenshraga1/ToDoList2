import { configureStore } from '@reduxjs/toolkit'

import missionsReducer from '../features/posts/MissionSlice'
import usersReducer from '../features/users/usersSlice'
let item =0;

export default configureStore({
  reducer: {
    missions: missionsReducer,
    users: usersReducer,
  },
})
