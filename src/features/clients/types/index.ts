import { Status } from '../../../constants'

export interface Client {
    id: string;
    name: string;
    city: string;
    mobile: string;
    status: Status;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}

export interface ClientForm {
    name: string;
    city: string;
    mobile: string;
    status: Status;
}