import { combineReducers } from 'redux';

const initialAuthState = { Msg: "", User: {}, Token: "" };
const initialCatState = { Msg: "", Cats: [] };
const initialHomeBlogState = { Msg: "", Blogs: [] };
const initialCatBlogState = { Msg: "", Blogs: [], Total: 0, Id: "", Search: "" };
const initialotherInfosState = { Msg: "", User: {} };
const initialuserBlogsReducer = { Msg: "", Blogs: [], Total: 0, Id: "", Search: "" };
const initialcommentsBlogsReducer = { Msg: "", data: [], Total: 0, Search: "" };
const initialsocketReducer = null;


const authReducer = (state = initialAuthState, action) => {
    switch(action.type) {
        case 'signUp': {
            state = action.payload;
            return state;
        }
        case 'activeAccount': {
            state = action.payload;
            return state;
        }
        case 'signIn': {
            state = action.payload;
            return state;
        }
        case 'RefreshToken': {
            state = action.payload;
            return state;
        }
        case 'signOut': {
            return {...initialAuthState, Msg: action.payload.Msg};
        }
        case 'forgotPassword': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const catReducer = (state = initialCatState, action) => {
    switch(action.type) {
        case 'CREATE_CATS': {
            state = action.payload;
            return state;
        }
        case 'GET_CATS': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const homeBlogsReducer = (state = initialHomeBlogState, action) => {
    switch(action.type) {
        case 'CREATE_BLOG': {
            state = action.payload;
            return state;
        }
        case 'GET_BLOGS': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const catBlogsReducer = (state = initialCatBlogState, action) => {
    switch(action.type) {
        case 'GET_BLOGS_BY_CAT': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const otherInfosReducer = (state = initialotherInfosState, action) => {
    switch(action.type) {
        case 'GET_USER': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const userBlogsReducer = (state = initialuserBlogsReducer, action) => {
    switch(action.type) {
        case 'GET_BLOGS_BY_USER_ID': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

const commentsBlogsReducer = (state = initialcommentsBlogsReducer, action) => {
    switch(action.type) {
        case 'GET_COMMENTS': {
            state = action.payload;
            return state;
        }
        case 'CREATE_COMMENT': {
            return { Msg: action.payload.Msg, data: [action.payload.Comment ,...state.data], Total: state.Total, Search: state.Search };
        }
        case 'REPLY_COMMENT': {
            return { 
                Msg: action.payload.Msg, 
                data: state.data.map(item => (
                    item._id === action.payload.Comment.comment_root
                    ? {...item, replyCM: [...item.replyCM , action.payload.Comment]}
                    : item
                )),
                Total: state.Total,
                Search: state.Search
            }
        }
        default: {
            return state;
        }
    }
}

const socketReducer = (state = initialsocketReducer, action) => {
    switch(action.type) {
        case 'SOCKET': {
            state = action.payload;
            return state;
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({
    auth: authReducer,
    cat: catReducer,
    homeBlogs: homeBlogsReducer,
    catBlogs: catBlogsReducer,
    otherInfos: otherInfosReducer,
    userBlogs: userBlogsReducer,
    comments: commentsBlogsReducer,
    socket: socketReducer
});