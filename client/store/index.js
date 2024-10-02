import {configureStore} from '@reduxjs/toolkit'
import {auth, blog, editor} from './slices'


export const store = configureStore({
    reducer: {
        auth: auth, 
        editor: editor,
        blog: blog,
    }
})