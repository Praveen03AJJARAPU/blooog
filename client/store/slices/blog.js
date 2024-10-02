import {createSlice} from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        tagSelected: 'any',
        blogStore: []
    },
    reducers: {
        addTag(state, action) {
            state.tagSelected = action.payload;
        },
        addBlogs(state, action) {
            state.blogStore = action.payload;
        }
    }
})

export const {addTag, addBlogs} = blogSlice.actions;
export default blogSlice.reducer;