"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "../button/Button";
import { useUser } from "@/hooks/useUser";
import { getStripe } from "@/libs/stripeClient";


interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
}

const Content: React.FC<SubscribeModalProps> = ({
  products
}) => {
  const [ priceIdLoading, setPriceIdLoading ] = useState<string>();
  const { user, isLoading, subscription } = useUser();
  
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in"); 
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already subscribed");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (products.length === 0) 
    return (
      <div>
        No products available
      </div>
    )
  
  if (subscription) {
    return (
      <div className="text-center">
        Already subscribed
      </div>
    )
  }
  
  return (
    <div>
      {products.map((product) => {
        if (!product.prices?.length) {
          return (
            <div key={product.id}>
              No prices available
            </div>
          )
        }
        
        return product.prices.map((price) => (
          <Button 
            key={price.id}
            onClick={() => handleCheckout(price)}
            disabled={isLoading || price.id === priceIdLoading}
            className="mb-4"
          >
            {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
          </Button>
        ))
      })
      }
    </div>
  )
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  products
}) => {
  return (
    <Modal 
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen
      onChange={() => {}}
    >
      <Content products={products}/>
    </Modal>
  )
}


export default SubscribeModal;