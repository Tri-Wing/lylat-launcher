import { colors } from "@common/colors";
import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import type { SelectChangeEvent } from "@mui/material";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import type { OpenDialogOptions } from "electron";
import React, { useEffect } from "react";

export interface PathSelectProps {
  onAdd: (filePath: string) => Promise<void>;
  onRemove: (filePath: string) => Promise<void>;
  onSelect: (filePath: string) => Promise<void>;
  value: string | null;
  items: string[] | null;
  options?: OpenDialogOptions;
  tooltipText?: string;
}

export const PathSelect = React.forwardRef<HTMLInputElement, PathSelectProps>((props) => {
  const { value, items, onAdd, onRemove, onSelect, options, tooltipText } = props;
  const [selected, setSelected] = React.useState<string | null>(value);
  const [menuItems, setMenuItems] = React.useState<string[] | null>(items);
  const [open, setOpen] = React.useState(false);

  const onClick = async () => {
    const result = await window.electron.common.showOpenDialog({ properties: ["openFile"], ...options });
    const res = result.filePaths;
    if (result.canceled || res.length === 0) {
      return;
    }
    if (items != null) {
      if (!items.includes(res[0])) {
        await onAdd(res[0]);
        setSelected(res[0]);
      }
    } else {
      await onAdd(res[0]);
      setSelected(res[0]);
    }
  };

  const onRemoveItem = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: string) => {
    event.stopPropagation();
    if (items !== null && items.includes(item)) {
      if (items.length <= 2) {
        setOpen(false);
      }
      const newMenuItems = items.filter((menuItem) => menuItem !== item);
      setMenuItems(newMenuItems);
      await onRemove(item);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    if (items !== null && items.length > 1) {
      setOpen(true);
    }
  };

  const handleChange = async (event: SelectChangeEvent) => {
    setSelected(event.target.value as string);
    await onSelect(event.target.value as string);
  };

  useEffect(() => {
    setMenuItems(items);
  }, [items, selected]);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  return (
    <Outer>
      <Box sx={{ width: "100%", display: "flex", marginRight: "8px" }}>
        <FormControl fullWidth>
          <Select
            value={selected ?? ""}
            onChange={handleChange}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            sx={{ fontSize: "14px", height: "40px", paddingLeft: "10px" }}
            disabled={items === null || items!.length < 2}
          >
            {(menuItems ?? []).map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{ fontSize: "14px" }}
                style={item === selected ? { display: "none" } : {}}
              >
                {item !== selected ? (
                  <Button
                    style={{ marginLeft: "-10px", height: "33px", minWidth: "33px" }}
                    onClick={async (event) => {
                      await onRemoveItem(event, item);
                    }}
                  >
                    <CloseIcon style={{ color: colors.grayPrimary }} />
                  </Button>
                ) : null}
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Tooltip title={tooltipText ?? ""}>
        <span>
          <Button color="secondary" variant="contained" onClick={onClick}>
            Add
          </Button>
        </span>
      </Tooltip>
    </Outer>
  );
});

const Outer = styled.div`
  display: flex;
`;
