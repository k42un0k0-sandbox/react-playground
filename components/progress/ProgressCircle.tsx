import {motion,useTransform, MotionValue} from "framer-motion"

type Props = {
  progress:MotionValue<number>,
  radius:number,
  strokeWidth:number
}
 
export default function ProgressCircle({progress,radius,strokeWidth}:Props) {
  const circumference =Math.ceil(2 * Math.PI * 40);
  const fillPercents = useTransform(progress,(latestProgress)=>Math.ceil((circumference / 100) * (100 - latestProgress)))
  const size = (radius+strokeWidth)*2
  return (
          <svg
            viewBox={`0 0 ${size} ${size}`}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            style={{
              transform: "rotate(-90deg)",
            }}
          >
            <motion.circle
              cx={size/2}
              cy={size/2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={"green"}
              fill="transparent"
              strokeDashoffset={fillPercents}
              strokeDasharray={circumference}
            />
          </svg>
  );
}
