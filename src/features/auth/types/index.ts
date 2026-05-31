import { Status, UserType } from "../../../constants";

export interface Profile {
    user_id: string;
    user_name: string;
    user_type: UserType;
    status: Status;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
