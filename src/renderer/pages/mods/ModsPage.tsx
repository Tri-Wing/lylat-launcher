import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

import { Footer } from "@/components/Footer";

import { ModsList } from "./ModsList";

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

export const ModsPage = React.memo(function ModsPage() {
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
          <h1>Featured Mods</h1>
          <ModsList />
        </Main>
      </div>
      <Footer />
    </Outer>
  );
});
