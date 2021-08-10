import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Stack } from "../../pagesComponents/animation/tinder/Stack";
import Fullsize from "../../components/layout/FullSize";

const flexCentering = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #f9fafb;
  width: 200px;
  height: 250px;
  ${flexCentering}
  font-size: 80px;
  text-shadow: 0 10px 10px #d1d5db;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  transform: rotate(${Math.random() * (5 - -5) + -5}deg);
`;

export default function App() {
  return (
    <Fullsize
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Stack
        style={{ background: "#1f2937", height: "100%", overflow: "hidden" }}
        onVote={(item, vote) => console.log(item.props, vote)}
      >
        <Card data-value="waffles">🧇</Card>
        <Card data-value="pancakes">🥞</Card>
        <Card data-value="donuts">🍩</Card>
      </Stack>
    </Fullsize>
  );
}
