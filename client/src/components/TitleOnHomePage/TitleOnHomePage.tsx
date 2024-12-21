import React, { useEffect, useState } from "react";

export default function TitleOnHomePage() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const titleString = "Welcome to Art!";
  const typingSpeed = 250;

  useEffect(() => {
    if (index < titleString.length) {
      const timeot = setTimeout(() => {
        setText((prevWord) => prevWord + titleString[index]);
        setIndex(index + 1);
      }, typingSpeed);

      return () => clearTimeout(timeot);
    }
  }, [index]);
  return <h1 className="title">{text}</h1>;
}
