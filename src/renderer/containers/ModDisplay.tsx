import { colors } from "@common/colors";
import { IsoValidity } from "@common/types";
import { css } from "@emotion/react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Popover, Typography } from "@mui/material";
import { DownloadType } from "mods/types";
import moment from "moment";
import React from "react";

import { useIsoVerification } from "@/lib/hooks/useIsoVerification";
import { useIsoPathVanilla } from "@/lib/hooks/useSettings";
import { useModActions } from "@/lib/mods/useModActions";
import { monthDayFormat } from "@/lib/time";
import { useServices } from "@/services";

import type { ModsListItem } from "../pages/mods/ModsList";

//add these to ModPost type later and get from gql server
const uploadDate = new Date("August 2, 2022 05:35:32").toISOString();
const updatedDate = new Date("September 9, 2022 01:25:01").toISOString();
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. ";
const downloadUrl = "REPLACE WITH TESTING URL";

interface ModDisplayProps {
  open: boolean;
  item: ModsListItem;
  onCancel: () => void;
}

export const ModDisplay = React.memo((props: ModDisplayProps) => {
  const [downloadType, setDownloadType] = React.useState<DownloadType | null>(null);
  const [popoverText, setPopoverText] = React.useState("");
  const [isoPathVanilla] = useIsoPathVanilla();
  const isoValidity = useIsoVerification((state) => state.validity);
  const { modService } = useServices();
  const { downloadISOPatch } = useModActions(modService);

  const downloadHandler = async (modCategory: string, downloadUrl: string) => {
    if (downloadType != null) {
      setPopoverText("Please wait for current download to complete");
      return;
    }

    if (modCategory === "ISO Patch") {
      if (isoValidity != IsoValidity.VALID) {
        setPopoverText(
          "Installing ISO mods requires a valid SSBM 1.02 ISO to be selected. Click the settings icon to add an ISO.",
        );
        return;
      }
      setDownloadType(DownloadType.ISOPATCH);

      if (isoPathVanilla) {
        await downloadISOPatch(downloadUrl, isoPathVanilla);
      }
      setDownloadType(null);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onCancel} fullWidth={true} closeAfterTransition={true}>
      <DialogContent sx={{ p: 0 }}>
        <DialogTitle sx={{ pt: 0, pb: 0 }}>{props.item.title}</DialogTitle>
        <Category category={props.item.category!} />
        <BannerImage imageSrc={props.item.image!} />
        <div
          css={css`
            width: 100%;
            height: 50px;
            display: flex;
          `}
        >
          <Details uploadDate={uploadDate} updatedDate={updatedDate} user={props.item.author!}></Details>
          <div
            css={css`
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <ButtonWithPopover
              buttonText="Download"
              popoverText={popoverText}
              onClick={() => {
                void downloadHandler(props.item.category!, downloadUrl);
              }}
              onClose={() => {
                setPopoverText("");
              }}
            ></ButtonWithPopover>
          </div>
        </div>
        <DialogContentText sx={{ pl: 1, pr: 1 }}>{description}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
});

const BannerImage = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div
      css={css`
        background-size: cover;
        background-position: center center;
        width: 100%;
        height: 250px;
        overflow: hidden;
        background-image: url("${imageSrc}");
      `}
    ></div>
  );
};

const Category: React.FC<{ category: string }> = ({ category }) => {
  return (
    <h3
      css={css`
        font-size: 11px;
        height: 15px;
        padding: 0px 24px 5px;
        margin: 0px;
        overflow: hidden;
        color: ${colors.bluePrimary};
      `}
    >
      {category}
    </h3>
  );
};

interface DetailProps {
  uploadDate: string;
  updatedDate: string;
  user: string;
}

function Details({ uploadDate, updatedDate, user }: DetailProps) {
  const uploadDateString = monthDayFormat(moment(uploadDate)) as string;
  const updatedDateString = monthDayFormat(moment(updatedDate)) as string;
  return (
    <p
      css={css`
        font-size: 11px;
        height: 20px;
        padding: 5px 0px 0px 10px;
        margin: 0px;
        overflow: hidden;
        flex: 3;
      `}
    >
      Uploaded: {uploadDateString} | Last Update: {updatedDateString} | User: {user}
    </p>
  );
}

interface ButtonWithPopoverProps {
  buttonText: string;
  popoverText: string;
  onClick: () => void;
  onClose: () => void;
}

function ButtonWithPopover({ buttonText, popoverText, onClick, onClose }: ButtonWithPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    onClose();
    setAnchorEl(null);
  };

  const open = popoverText != "";
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" color="primary" size="small" onClick={handleClick}>
        {buttonText}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography variant="caption" sx={{ p: 2 }}>
          {popoverText}
        </Typography>
      </Popover>
    </div>
  );
}
