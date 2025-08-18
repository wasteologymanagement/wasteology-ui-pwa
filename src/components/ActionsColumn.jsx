import {
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon,
  Block as BlockIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog"; // reusable dialog

export const ActionsColumn = ({
  params,
  handleEditClick,
  handleSoftDelete,
  handlePermanentDelete,
  handleActivate,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogType, setDialogType] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleConfirm = () => {
    // List of possible ID field keys
    const possibleIds = ['id', 'pickerId', 'userId'];

    // Safely extract the first existing ID
    const row = params.row;
    const id = possibleIds.find((key) => row?.[key] !== undefined && row[key] !== null)
      ? row[possibleIds.find((key) => row?.[key] !== undefined && row[key] !== null)]
      : null;

    if (!id) {
      console.warn("No valid ID found in row:", row);
      return;
    }

    console.log("confirming:", row);

    // Perform action based on dialogType
    if (dialogType === "soft" && handleSoftDelete) {
      handleSoftDelete(id);
    } else if (dialogType === "permanent" && handlePermanentDelete) {
      handlePermanentDelete(id);
    } else if (dialogType === "activate" && handleActivate) {
      handleActivate(id);
    } 

    setDialogType(null);
  };


  const isInactive = params.row?.active === false;
  const isRequested = params.row?.status === 'REQUESTED';

  return (
    <>
      {/* Menu Button */}
      <Tooltip title="Actions">
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Edit option */}
        {!isInactive && handleEditClick && (
          <MenuItem
            onClick={() => {
              handleEditClick(params.row);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: '#2196f3' }} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {/* Soft Delete option */}
        {!isInactive && handleSoftDelete && (
          <MenuItem
            onClick={() => {
              setDialogType("soft");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <BlockIcon fontSize="small" sx={{ color: '#FFA726' }} />
            </ListItemIcon>
            <ListItemText>Inactive</ListItemText>
          </MenuItem>
        )}

        {/* Permanent Delete option */}
        {!isInactive && handlePermanentDelete && (
          <MenuItem
            onClick={() => {
              setDialogType("permanent");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" sx={{ color: "#e91e63" }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}

        {/* Activate option */}
        {isInactive && handleActivate && (
          <MenuItem
            onClick={() => {
              setDialogType("activate");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <RestoreIcon fontSize="small" sx={{ color: '#4caf50' }} />
            </ListItemIcon>
            <ListItemText>Active</ListItemText>
          </MenuItem>
        )}
      </Menu>

      

      {/* Reusable Confirmation Dialog */}
      <ConfirmationDialog
        open={!!dialogType}
        onClose={() => setDialogType(null)}
        onConfirm={handleConfirm}
        title={
          dialogType === "soft"
            ? "Deactivate Item"
            : dialogType === "permanent"
              ? "Permanently Delete Item"
              : dialogType === "activate"
                ? "Activate Item"
                : dialogType === "other"
                  ? "other"
                  : ""
        }
        description={
          dialogType === "soft"
            ? "Are you sure you want to deactivate this item? You can restore it later."
            : dialogType === "permanent"
              ? "This action cannot be undone. Are you sure you want to permanently delete this item?"
              : dialogType === "activate"
                ? "Are you sure you want to activate this item?"
                : dialogType === "other"
                  ? "other infuture"
                  : ""
        }
        confirmText={
          dialogType === "soft"
            ? "Deactivate"
            : dialogType === "permanent"
              ? "Delete"
              : dialogType === "activate"
                ? "Activate"
                : dialogType === "other"
                  ? "Other"
                  : "Confirm"
        }
      />

    </>
  );
};
