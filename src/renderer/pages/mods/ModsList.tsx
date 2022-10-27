import { colors } from "@common/colors";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Card } from "@mui/material";
import React from "react";

import fodBanner from "@/styles/images/stages/2.png";
import stadiumBanner from "@/styles/images/stages/3.png";
import muteCityBanner from "@/styles/images/stages/10.png";
import dreamlandBanner from "@/styles/images/stages/28.png";

import { ModDisplay } from "../../containers/ModDisplay";

export interface ModsListItem {
  title?: string;
  image?: string;
  author?: string;
  category?: string;
  subtitle?: string;
}

const akaneiaDesc =
  "The Akaneia Build is a ground-breaking Melee mod that adds new viable and authentic content to the game such as costumes, stages, and more.";

const modsListItems: ModsListItem[] = [
  {
    title: "Akaneia Build",
    image: stadiumBanner,
    author: "Team Akaneia",
    category: "ISO Patch",
    subtitle: akaneiaDesc,
  },
  {
    title: "Midnight Melee",
    image: fodBanner,
    author: "Team Midnight",
    category: "ISO Patch",
    subtitle: akaneiaDesc,
  },
  {
    title: "Animelee",
    image: muteCityBanner,
    author: "Animelee Team",
    category: "ISO Patch",
    subtitle: akaneiaDesc,
  },
  {
    title: "Custom Melee",
    image: dreamlandBanner,
    author: "Mod Author",
    category: "ISO Patch",
    subtitle: akaneiaDesc,
  },
];

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

export const ModsList = React.memo(function ModsList() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<ModsListItem>({});
  const openModal = (item: ModsListItem) => {
    setModalContent(item);
    setModalOpen(true);
  };
  const onCancel = () => {
    setModalOpen(false);
  };
  return (
    <Main>
      <ModDisplay open={modalOpen} item={modalContent} onCancel={onCancel} />
      {modsListItems.map((item) => {
        return (
          <Card
            style={cardStyle}
            sx={{ m: 1 }}
            key={item.title}
            onClick={() => {
              openModal(item);
            }}
          >
            <PreviewImage imageSrc={item.image ?? ""}></PreviewImage>
            <Title>{item.title}</Title>
            <Category>{item.category}</Category>
            <Subtitle content={item.subtitle ?? ""} />
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

const Subtitle: React.FC<{
  content: string;
}> = ({ content }) => {
  const fontSize = content.length > 80 ? "12px" : "14px";
  return (
    <p
      css={css`
        font-size: ${fontSize};
        padding: 0px 5px;
        margin: 0px;
        height: 100px;
        overflow: hidden;
      `}
    >
      {content}
    </p>
  );
};
