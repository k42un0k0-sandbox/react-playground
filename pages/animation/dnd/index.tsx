//https://www.w3schools.com/html/html5_draganddrop.asp

import { useState } from "react";

export default function DnD() {
  const [state, setState] = useState(true);
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
  return (
    <div>
      <button onClick={() => setState(!state)}>aaa</button>
      <div
        id="div1"
        onDrop={drop}
        onDragOver={allowDrop}
        style={{
          width: "350px",
          height: "70px",
          padding: "10px",
          border: "1px solid #aaaaaa",
        }}
      ></div>
      <div
        id="div2"
        onDrop={drop}
        onDragOver={allowDrop}
        style={{
          width: "350px",
          height: "70px",
          padding: "10px",
          border: "1px solid #aaaaaa",
        }}
      >
        <div
          id="drag1"
          draggable="true"
          onDragStart={drag}
          style={{
            backgroundColor: "black",
            width: 80,
            height: state ? 30 : 80,
          }}
        ></div>
      </div>
    </div>
  );
}
