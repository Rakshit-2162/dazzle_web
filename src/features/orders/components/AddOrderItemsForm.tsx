import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabaseClient";
import type { Product } from "../../products/types";
import type { OrderItemForm } from "../types";
import DazzleStepper from "../../../shared/components/DazzleStepper";
import StepSelectItems from "./StepSelectItems";
import StepReviewItems from "./StepReviewItems";

interface AddOrderItemsFormProps {
  onSubmit: (items: OrderItemForm[]) => Promise<void>;
  isLoading?: boolean;
}

const AddOrderItemsForm = ({ onSubmit, isLoading }: AddOrderItemsFormProps) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<OrderItemForm[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "ACT")
        .order("name");
      if (data) setProducts(data as Product[]);
    };
    fetchProducts();
  }, []);

  const steps = [t("orderItems.selectItems"), t("orderItems.reviewItems")];

  return (
    <DazzleStepper
      steps={steps}
      isLoading={isLoading}
      onConfirm={async () => {
        if (cart.length === 0) return;
        await onSubmit(cart);
        setCart([]);
      }}
      stepContents={[
        <StepSelectItems products={products} cart={cart} setCart={setCart} />,
        <StepReviewItems cart={cart} products={products} setCart={setCart} />,
      ]}
    />
  );
};

export default AddOrderItemsForm;
