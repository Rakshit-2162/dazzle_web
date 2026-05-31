import { Status } from '../../../constants'

export interface Product {
    id: string;
    category_id: string;
    code: string;
    name: string;
    status: Status;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}
