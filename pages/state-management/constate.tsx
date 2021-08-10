import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useCycle,
  useDragControls,
} from "framer-motion";
import { useState } from "react";

export default function Constate() {
  const [inVisible, setInVisible] = useState(false);

  const theta = useSpring(0, { duration: 1000, bounce: 100 });
  const left = useTransform(
    theta,
    (latestTheta) => Math.cos(latestTheta) * 100
  );
  const top = useTransform(theta, (latestTheta) => Math.sin(latestTheta) * 100);
  const rad = useTransform(
    theta,
    (latestTheta) => latestTheta * (180 / Math.PI)
  );
  const shadowX = useSpring(0, { duration: 1000 });
  const [x, cycleX] = useCycle(0, 50, 100);
  const dragControls = useDragControls();

  function startDrag(event) {
    dragControls.start(event, { snapToCursor: true });
  }
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div onPointerDown={startDrag}>ｱｱｱ</div>
      <motion.div drag="x" dragControls={dragControls}>
        いいい
      </motion.div>
      <motion.div animate={{ x: x }} onTap={() => cycleX()}>
        あああ
      </motion.div>
      constate
      <button
        onClick={() => {
          shadowX.set(100);
          theta.set(theta.get() === 0 ? 2 * Math.PI : 0);
          setInVisible(!inVisible);
        }}
      >
        押せ
      </button>
      <motion.div
        style={{
          transformOrigin: "bottom center",
          textAlign: "center",
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {
            scale: 0.8,
            opacity: 0,
          },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.4,
            },
          },
        }}
      >
        <h1 className="title">Wubba Lubba Dub Dub!</h1>
      </motion.div>
      <motion.div
        style={{
          textAlign: "center",
          transformOrigin: "center center",
          x: left,
          y: top,
          rotate: rad,
        }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        ああああ
      </motion.div>
      {inVisible && (
        <motion.div
          layoutId="unko"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          へぉ
        </motion.div>
      )}
    </motion.main>
  );
}
