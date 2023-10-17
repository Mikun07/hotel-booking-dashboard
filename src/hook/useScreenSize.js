import React, { useState, useEffect } from 'react';

function useScreenSize() {
    const [ width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      window.addEventListener("resize", resizeHandler)
    
      return () => {
        window.removeEventListener("resize", resizeHandler)
      }
    }, [window.innerWidth])

    const resizeHandler = () => {
        setWidth(window.innerWidth)
    };
    
  return {
    width
  }
}

export default useScreenSize