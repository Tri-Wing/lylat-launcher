import { css } from "@emotion/react";

import lylatLogo from "@/styles/images/lylat-logo.svg";

export const withLylatBackground = css`
  &::before {
    content: "";
    background-image: url("${lylatLogo}");
    background-size: 50%;
    background-position: 110% 120%;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.1;
    z-index: -1;
  }
`;
