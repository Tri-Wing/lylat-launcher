import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

import { Footer } from "@/components/Footer";

const Outer = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  position: relative;
  min-width: 0;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  padding: 20px;
  padding-top: 0;
`;

export const ModInfoPage = React.memo(function ModsPage() {
  return (
    <Outer>
      <div
        css={css`
          display: flex;
          flex: 1;
          position: relative;
          overflow: hidden;
        `}
      >
        <Main>
          <h1>Mod Info</h1>
        </Main>
      </div>
      <Footer />
    </Outer>
  );
});
