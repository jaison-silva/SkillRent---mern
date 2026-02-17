import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { User } from "../../types"
 
// interface PayloadAction<P> {
//   type: string;
//   payload: P;
// }

interface AuthState {
    user: User | null
    token: string | null
}

const initialState: AuthState = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            const { user, token } = action.payload
            state.user = user;
            state.token = token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null
        }
    }
})

// authSlice oru object ahnnu with name, reducer, actions okke ayit

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;