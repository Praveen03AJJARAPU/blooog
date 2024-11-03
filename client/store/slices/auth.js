import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isLoggedIn: true,
      user: null,
      openOTPSlide: false,
      otp: '',
    },
    reducers: {
      setUserData:(state, action) => {
        state.user = action.payload;
      },
      setLogIn: (state, action) => {
        state.isLoggedIn = action.payload.loggedIn;
        state.user = action.payload.user || null;
      },
      setLogOut: (state) => {
        state.isLoggedIn = false;
        state.user = null;
      },
      setOTPSlide(state, action) {
        state.openOTPSlide = action.payload
      },
      setOtp(state, action) {
        state.otp = action.payload;
      }
    },
  });
  
  export const { setLogIn, setLogOut, setUserData, setOTPSlide, setOtp } = authSlice.actions;
  
  export default authSlice.reducer; 