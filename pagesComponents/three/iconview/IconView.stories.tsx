import React, { useEffect } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { IconView } from "./IconView";
import { useBasicview } from "../useBasicView";
import { loadFont } from "./load-font";

const IconViewComp = () => {
  useBasicview(async () => {
    await loadFont();
    return new IconView(document.body);
  });
  return null;
};
export default {
  title: "three/iconview/IconView",
  component: IconViewComp,
} as ComponentMeta<typeof IconViewComp>;

const Template: ComponentStory<typeof IconViewComp> = (args) => (
  <IconViewComp {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
