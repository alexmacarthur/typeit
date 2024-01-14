import React, { useState } from "react";
import TypeIt from "../src/index";

const SuperStrong = ({ children }) => {
  return <strong style={{ fontSize: "80px" }}>{children}</strong>;
};

const App = () => {
  const [options, setOptions] = useState({ speed: 50, loop: true });
  const [showElements, setShowElements] = useState(true);

  return (
    <>
      {showElements && (
        <>
          {/* <TypeIt className="test" options={options}>
            This is the first example.
          </TypeIt> */}

          <br />

          <TypeIt as={"h3"}>This will be typed in an H3 tag.</TypeIt>

          {/* <TypeIt>
            Weak text. <SuperStrong>Super strong text.</SuperStrong>
          </TypeIt> */}

          <br />

          {/* <TypeIt>And this is another example.</TypeIt> */}
          <br />
          {/* <TypeIt
            options={{
              strings: "A final one!",
              ...options,
            }}
          /> */}
        </>
      )}

      <br></br>

      <button
        onClick={() => {
          const newSpeed = Math.random() * 1000;
          setOptions({ ...options, speed: newSpeed });
        }}
      >
        Change Speed
      </button>

      <br />

      <button onClick={() => setShowElements((c) => !c)}>Toggle</button>
    </>
  );
};

export default App;
