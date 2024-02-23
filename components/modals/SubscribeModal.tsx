"use client";

import { ProductWithPrice } from "@/types";
import Modal from "./Modal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const Content = () => {
  return (
    <div>
      No products available
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
      <Content />
    </Modal>
  )
}


export default SubscribeModal;