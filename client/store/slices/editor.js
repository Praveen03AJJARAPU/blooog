import {createSlice } from '@reduxjs/toolkit';

const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        content: '',
        title: '',
        subTitle: '',
        tags: [],
    },
    reducers: {
        setContent(state, action) {
            state.content = action.payload;
        },
        addTags(state, action) {
            state.tags.push(action.payload);
        },
        deletTags(state, action) {
            state.tags = state.tags.filter(tag => tag !== action.payload);
        },
        setTitle(state, action) {
            state.title = action.payload;
        },
        setSubTitle(state, action) {
            state.subTitle = action.payload;
        },
    }
})

export const {setContent, addTags, deletTags, setTitle, setSubTitle} = editorSlice.actions;
export default editorSlice.reducer;