import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers: {
        addRequests: (state, action) => action.payload,
        removeRequests: (state) => {
            return null;
        },
         removeRequestById: (state, action) => {
            const requestIdToRemove = action.payload;
            if (Array.isArray(state)) {
                return state.filter(request => request._id !== requestIdToRemove);
            }
            return state; 
        },
    }
});

export const{addRequests, removeRequests, removeRequestById} = requestSlice.actions;
export default requestSlice.reducer; 