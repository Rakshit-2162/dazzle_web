import { Status, CategoryType } from '../../../constants'

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    status: Status;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}