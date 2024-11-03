import {createSlice} from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        tagSelected: 'any',
        blogStore: [],
        top: [],
        commentSlide: false,
        openEdit: false,
    },
    reducers: {
        addTag(state, action) {
            state.tagSelected = action.payload;
        },
        topUsers(state, action) {
            state.top = action.payload;
        },
        addBlogs(state, action) {
            state.blogStore = action.payload;
        },
        toggleSection(state, action) {
            state.commentSlide = action.payload;
        },
        toggleEdit(state, action) {
            state.openEdit = action.payload;
        }
    }
})

export const {addTag, addBlogs, toggleSection, topUsers, toggleEdit} = blogSlice.actions;
export default blogSlice.reducer;