import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import "./HomePage.css";

export default function HomePage() {
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

  return (
    <div className="main-conteiner-home-page">
      <NavigationBar />
      <h1 className="title">{text}</h1>
    </div>
  );
}
