import { colors } from "@common/colors";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Card } from "@mui/material";
import { fetchFeaturedModPosts, fetchModPostDetails } from "mods/install/fetchModPosts";
import { Game } from "mods/types";
import React, { useEffect } from "react";

import type { ModPost } from "../../containers/ModDisplay";
import { ModDisplay } from "../../containers/ModDisplay";

export interface ModsListItem {
  title?: string;
  image?: string;
  author?: string;
  category?: string;
  subtitle?: string;
}

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const cardStyle = {
  width: `200px`,
  height: `250px`,
  cursor: `pointer`,
};

let featuredModPostsCache: any[];
const openedModPostsCache: any[] = [];

export const ModsList = React.memo(function ModsList() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<ModPost | null>(null);
  const [featuredModPosts, setFeaturedModPosts] = React.useState<any[] | null>(null);
  const openModal = async (item: any) => {
    if (openedModPostsCache.length === 0 || !openedModPostsCache.find((post) => post.id === item.id)) {
      const modPost = await fetchModPostDetails(item.id);
      openedModPostsCache.push(modPost);
    }
    setModalContent({ ...item, ...openedModPostsCache.find((post) => post.id === item.id) });
    setModalOpen(true);
  };
  const onCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    void (async function () {
      try {
        if (!featuredModPostsCache) {
          featuredModPostsCache = await fetchFeaturedModPosts(Game.MELEE);
        }
        setFeaturedModPosts(featuredModPostsCache);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Main>
      <ModDisplay open={modalOpen} post={modalContent} onCancel={onCancel} />
      {(featuredModPosts ?? []).map((item) => {
        return (
          <Card
            style={cardStyle}
            sx={{ m: 1 }}
            key={item.title}
            onClick={() => {
              void openModal(item);
            }}
          >
            <PreviewImage imageSrc={item.thumbnail_url ?? ""}></PreviewImage>
            <Title>{item.title}</Title>
            <Category>{item.category}</Category>
          </Card>
        );
      })}
    </Main>
  );
});

const PreviewImage = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div
      css={css`
        background-size: cover;
        background-position: center center;
        width: 100%;
        height: 40%;
        overflow: hidden;
        background-image: url("${imageSrc}");
      `}
    ></div>
  );
};

const Title: React.FC = ({ children }) => {
  return (
    <div
      css={css`
        text-align: center;
        h3 {
          color: #ffffff;
          margin: 5px;
        }
      `}
    >
      <h3>{children}</h3>
    </div>
  );
};

const Category: React.FC = ({ children }) => {
  return (
    <div
      css={css`
        text-align: left;
        h3 {
          color: ${colors.bluePrimary};
          margin: 0;
          margin: 5px 10px;
          font-size: 11px;
        }
      `}
    >
      <h3>{children}</h3>
    </div>
  );
};
