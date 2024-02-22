"use client";

import Box from "@/components/Box";
import { BounceLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <Box className="h-full flex items-center justify-center">
        <BounceLoader color="#22c55e" />
    </Box>
  )
}

export default LoadingPage