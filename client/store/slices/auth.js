import {createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isLoggedIn: false,
      user: null,
    },
    reducers: {
      setLogIn: (state, action) => {
        state.isLoggedIn = action.payload.loggedIn;
        state.user = action.payload.user || null;
      },
      setLogOut: (state) => {
        state.isLoggedIn = false;
        state.user = null;
      },
    },
  });
  
  export const { setLogIn, setLogOut } = authSlice.actions;
  
  export default authSlice.reducer; 