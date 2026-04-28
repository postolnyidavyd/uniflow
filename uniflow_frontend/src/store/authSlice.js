import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    isAuthenticated: false,
    user: null,
    // user: { id, email, firstName, lastName, group, role }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setCredentials(state, action) {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout() {
            return initialState;
        },
    },
});

export const { setAccessToken, setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;