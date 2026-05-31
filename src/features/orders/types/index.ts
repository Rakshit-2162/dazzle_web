import { OrderStatus } from "../../../constants";
import type { Client } from "../../clients/types";
import type { Product } from "../../products/types";

export interface OrderMaster {
  id: string;
  client_id: string;
  total_qty: number;
  remarks: string;
  order_status: OrderStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  client?: Client;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_code: string;
  qty: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  product?: Product;
}
