import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { RootState } from ".";
import { UserPublicData } from "../API/models/UserPublicData";

export interface UserState extends UserPublicData{
    
}

export const initialState = null as UserState | null;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        assignUser: (_, action: PayloadAction<UserState>) => {
            return action.payload;
        },
        resetUser: () => {
            return null;
        }
    }
})

export const {assignUser, resetUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;