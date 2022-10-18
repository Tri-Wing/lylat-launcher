import { css } from "@emotion/react";

import { LoadingScreen } from "@/components/LoadingScreen";
import { BuildInfo } from "@/containers/Settings/BuildInfo";
import { withLylatBackground } from "@/styles/withLylatBackground";

export const LoadingView = () => {
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <LoadingScreen css={withLylatBackground} message="Just a sec..." />
      <div
        css={css`
          position: fixed;
          bottom: 0;
          left: 0;
        `}
      >
        <BuildInfo />
      </div>
    </div>
  );
};
