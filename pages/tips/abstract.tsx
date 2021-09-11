import React, { useState, createContext, useContext } from "react";

export default function Abstract() {
  const [state, toNext] = useCurrentState();
  const presenter = usePresenter(state);
  return <Comp toNext={toNext} presenter={presenter} />;
}

function Comp({
  toNext,
  presenter,
}: {
  toNext: () => void;
  presenter: Presenter;
}) {
  const [state, setState] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setState(state + 1);
        }}
      >
        update{state}
      </button>
      <button
        onClick={() => {
          toNext();
        }}
      >
        next{presenter.value}
      </button>
      <button onClick={presenter.exec}>おせ</button>
    </div>
  );
}

type State = 1 | 2 | 3;
function useCurrentState(): [State, () => void] {
  const [state, setState] = useState<State>(1);
  const toNext = () => {
    setState(((state % 3) + 1) as State);
  };
  return [state, toNext];
}
type Presenter = {
  value: number;
  exec(): void;
};

function usePresenter(state: State) {
  switch (state) {
    case 1:
      return new Derive1();
    case 2:
      return new Derive2();
    case 3:
    default:
      return new Derive3();
  }
}
class Derive1 implements Presenter {
  value = 1;
  constructor() {
    this.exec = this.exec.bind(this);
  }
  exec() {
    console.log("derive 1", this.value++);
  }
}
class Derive2 implements Presenter {
  value = 1;
  constructor() {
    this.exec = this.exec.bind(this);
  }
  exec() {
    console.log("derive 2", this.value++);
  }
}

class Derive3 implements Presenter {
  value = 1;
  constructor() {
    this.exec = this.exec.bind(this);
  }
  exec() {
    console.log("derive 3", this.value++);
  }
}
