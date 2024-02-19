"use client";

import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Modal 
                title="Test modal"
                description="Test description"
                isOpen
                onChange={() => {}}
            >
                This is a test modal. It{'\''}s not really doing anything yet!
            </Modal>
        </>
    )
}

export default ModalProvider;