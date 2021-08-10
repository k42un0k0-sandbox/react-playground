import React, { useState, useRef, useEffect, ComponentProps } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { VoteResult } from "./types";

enum Direction {
  left,
  right,
  none,
}

export default function Item({
  children,
  onVote,
  ...props
}: {
  children: React.ReactNode;
  onVote: (result: VoteResult) => void;
} & ComponentProps<typeof motion.div>) {
  // motion stuff
  const cardElem = useRef(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const [constrained, setConstrained] = useState(true);

  const [direction, setDirection] = useState<Direction>(Direction.none);

  const [velocity, setVelocity] = useState(0);

  const getChildClientRect = () => cardElem.current.getBoundingClientRect();
  const getParentClientRect = () =>
    cardElem.current.parentNode.getBoundingClientRect();

  const getVoteResult = () => {
    const childRect = getChildClientRect();
    const parentRect = getParentClientRect();
    let result =
      parentRect.left >= childRect.right
        ? VoteResult.no
        : parentRect.right <= childRect.left
        ? VoteResult.yes
        : VoteResult.notYet;
    return result;
  };

  // determine direction of swipe based on velocity
  const getDirection = () => {
    return velocity >= 1
      ? Direction.right
      : velocity <= -1
      ? Direction.left
      : Direction.none;
  };

  const setTrajectory = () => {
    setVelocity(x.getVelocity());
    setDirection(getDirection());
  };

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      const result = getVoteResult();
      result !== VoteResult.notYet && onVote(result);
    });

    return () => unsubscribeX();
  });

  const flyAway = () => {
    const flyAwayDistance = () => {
      const parentWidth = getParentClientRect().width;
      const childWidth = getChildClientRect().width;
      const distance = parentWidth / 2 + childWidth / 2;
      return direction === Direction.left ? -distance : distance;
    };

    setConstrained(false);
    controls.start({
      x: flyAwayDistance(),
    });
  };
  const handleDragEnd = () => {
    const shouldFlayAway = (minVelocity: number) =>
      direction != Direction.none && Math.abs(velocity) > minVelocity;

    if (shouldFlayAway(500)) {
      flyAway();
    }
  };
  return (
    <motion.div
      animate={controls}
      dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      ref={cardElem}
      style={{ x, position: "absolute" }}
      onDrag={setTrajectory}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
