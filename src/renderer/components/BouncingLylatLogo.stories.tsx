import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { BouncingLylatLogo } from "./BouncingLylatLogo";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/BouncingLylatLogo",
  component: BouncingLylatLogo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BouncingLylatLogo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BouncingLylatLogo> = (args) => <BouncingLylatLogo {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
