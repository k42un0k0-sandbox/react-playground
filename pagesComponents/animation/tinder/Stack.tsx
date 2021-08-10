import React, { useState, Children, ComponentProps } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Item from "./Item";
import { VoteResult } from "./types";

const flexCentering = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;
// basic default styles for container
const Frame = styled.div`
  width: 100%;
  ${flexCentering}
  position: relative;
`;

const useChildrenToStack = (children: React.ReactNode | React.ReactNode[]) => {
  const [stack, set] = useState(Children.toArray(children));

  // return new array with last item removed
  const pop = () => {
    const last = stack[stack.length - 1];
    set(stack.slice(0, -1));
    return last;
  };
  return { stack, pop };
};
export const Stack = ({
  onVote,
  children,
  ...props
}: {
  onVote: (item: any, result: VoteResult) => void;
  children: React.ReactNode;
} & ComponentProps<typeof Frame>) => {
  const { stack, pop } = useChildrenToStack(children);

  const handleVote = (item, vote) => {
    pop();
    // run function from onVote prop, passing the current item and value of vote
    onVote(item, vote);
  };

  return (
    <Frame {...props}>
      {stack.map((item, index) => {
        let isTop = index === stack.length - 1;
        return (
          <Item
            drag={isTop} // Only top card is draggable
            key={item instanceof Object && "key" in item ? item.key : index}
            onVote={(result) => handleVote(item, result)}
          >
            {item}
          </Item>
        );
      })}
    </Frame>
  );
};
