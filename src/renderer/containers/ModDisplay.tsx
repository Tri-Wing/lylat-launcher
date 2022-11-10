import { colors } from "@common/colors";
import { IsoValidity } from "@common/types";
import { css } from "@emotion/react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, Popover, Typography } from "@mui/material";
import { DownloadType, ModCategory } from "mods/types";
import moment from "moment";
import path from "path";
import React from "react";

import { useIsoVerification } from "@/lib/hooks/useIsoVerification";
import { useIsoPathVanilla } from "@/lib/hooks/useSettings";
import { useToasts } from "@/lib/hooks/useToasts";
import { useModActions } from "@/lib/mods/useModActions";
import { monthDayFormat } from "@/lib/time";
import { useServices } from "@/services";

export interface ModPost {
  id: number;
  title: string;
  thumbnail_url: string;
  category: string;
  description: string;
  author: string;
  filename: string;
  download_url: string;
  alternate_url: string;
  image_urls: string[];
  upload_date: string;
  update_date: string;
  downloads: number;
  likes: number;
}

interface ModDisplayProps {
  open: boolean;
  post: ModPost | null;
  onCancel: () => void;
}

export const ModDisplay = React.memo((props: ModDisplayProps) => {
  const [downloadType, setDownloadType] = React.useState<DownloadType | null>(null);
  const [popoverText, setPopoverText] = React.useState("");
  const [isoPathVanilla] = useIsoPathVanilla();
  const isoValidity = useIsoVerification((state) => state.validity);
  const { modService } = useServices();
  const { downloadISOPatch, installISOPatch } = useModActions(modService);
  const { showCustomToast, updateToast, showError, showSuccess, dismissToast } = useToasts();

  const downloadHandler = async (modCategory: string, fileName: string, downloadUrl: string) => {
    if (downloadType != null) {
      setPopoverText("Please wait for current download to complete");
      return;
    }

    console.log(modCategory);

    if (modCategory === ModCategory.ISOPATCH) {
      if (isoValidity === IsoValidity.UNVALIDATED) {
        setPopoverText("Please wait for your SSBM 1.02 ISO to be validated. Try again in a moment.");
        return;
      } else if (isoValidity !== IsoValidity.VALID) {
        setPopoverText(
          "Installing ISO mods requires a valid SSBM 1.02 ISO to be selected. Click the settings icon to add an ISO.",
        );
        return;
      }
      setDownloadType(DownloadType.ISOPATCH);

      if (isoPathVanilla) {
        const result = await window.electron.common.showOpenDialog({ properties: ["openDirectory"] });
        if (result.canceled || result.filePaths[0].length === 0) {
          setDownloadType(null);
          return;
        }
        const destinationPath = path.join(result.filePaths[0], fileName + ".iso");
        const patchFileName = new Date().valueOf().toString() + ".xdelta";

        const toastId = showCustomToast(`Downloading ${fileName}...`, {
          autoClose: false,
          hideProgressBar: true,
          position: "bottom-right",
          theme: "dark",
        });
        try {
          const downloadSuccess = await downloadISOPatch(downloadUrl, patchFileName);
          if (downloadSuccess) {
            setDownloadType(null);
            updateToast(toastId, {
              render: `Installing ${fileName}...`,
            });
            const installSuccess = await installISOPatch(isoPathVanilla, destinationPath, patchFileName);
            if (installSuccess) {
              dismissToast(toastId);
              showSuccess(`${fileName} successfully installed.`);
            }
          }
        } catch (error) {
          dismissToast(toastId);
          showError(error);
        }
        setDownloadType(null);
      }
    }
  };

  const modPost = props.post;

  if (modPost != null) {
    return (
      <Dialog open={props.open} onClose={props.onCancel} fullWidth={true} closeAfterTransition={true}>
        <DialogContent sx={{ p: 0 }}>
          <DialogTitle sx={{ pt: 0, pb: 0 }}>{modPost.title}</DialogTitle>
          <Category category={modPost.category!} />
          <BannerImage imageSrc={modPost.image_urls[0]!} />
          <div
            css={css`
              width: 100%;
              height: 50px;
              display: flex;
            `}
          >
            <Details
              uploadDate={modPost.upload_date}
              updatedDate={modPost.update_date}
              user={modPost.author!}
            ></Details>
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
                  void downloadHandler(modPost.category, modPost.filename, modPost.download_url);
                }}
                onClose={() => {
                  setPopoverText("");
                }}
              ></ButtonWithPopover>
            </div>
          </div>
          <DialogContentText sx={{ pl: 1, pr: 1 }}>{modPost.description}</DialogContentText>
        </DialogContent>
      </Dialog>
    );
  } else {
    return <></>;
  }
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
