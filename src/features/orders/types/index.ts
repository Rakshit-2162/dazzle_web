import { OrderStatus } from "../../../constants";
import type { Client } from "../../clients/types";
import type { Product } from "../../products/types";

export interface OrderMaster {
  id: string;
  order_no: number;
  client_id: string;
  total_qty: number;
  remarks: string;
  order_status: OrderStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  clients?: Client;
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
  products?: Product;
}

export interface OrderMasterForm {
  client_id: string;
  remarks: string;
  order_status: OrderStatus;
}

export interface OrderItemForm {
  product_code: string;
  qty: number;
}
