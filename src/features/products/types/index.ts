import { Status } from '../../../constants'
import type { Category } from '../../categories/types';

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
    categories?: Category;
}

export interface ProductForm {
    code: string;
    name: string;
    status: Status;
}
