import {createSlice} from '@reduxjs/toolkit'

const animationSlice = createSlice({
    name: 'animation',
    initialState: {
        active: false,
    },
    reducers: {
        setActive(state, action) {
            state.active = action.payload;
        }
    }
})

export const {setActive} = animationSlice.actions;
export default animationSlice.reducer;