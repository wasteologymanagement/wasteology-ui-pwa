import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon,
  Block as BlockIcon
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
import ConfirmationDialog from "./ConfirmationDialog"; // your reusable dialog

export const ActionsColumn = ({
  params,
  handleEditClick,
  handleSoftDelete,
  handlePermanentDelete,
  handleActivate, // 👈 add this prop
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'soft', 'permanent', or 'activate'

  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleConfirm = () => {
    const { id } = params.row;
    if (dialogType === "soft") {
      handleSoftDelete(id);
    } else if (dialogType === "permanent") {
      handlePermanentDelete(id);
    } else if (dialogType === "activate") {
      handleActivate(id);
    }
    setDialogType(null);
  };

  const isInactive = params.row?.active === false;

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
        {!isInactive && [
          <MenuItem
            key="edit"
            onClick={() => {
              handleEditClick(params.row);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: '#2196f3' }}/>
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>,

          <MenuItem
            key="soft-delete"
            onClick={() => {
              setDialogType("soft");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <BlockIcon fontSize="small" sx={{ color: '#FFA726' }} />
            </ListItemIcon>
            <ListItemText>Deactive</ListItemText>
          </MenuItem>,

          <MenuItem
            key="permanent-delete"
            onClick={() => {
              setDialogType("permanent");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" sx={{ color: "#e91e63" }}/>
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>,
        ]}


        {isInactive && (
          <MenuItem
            onClick={() => {
              setDialogType("activate");
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <RestoreIcon fontSize="small" sx={{ color: '#4caf50' }}/>
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
              : "Activate Item"
        }
        description={
          dialogType === "soft"
            ? "Are you sure you want to deactivate this item? You can restore it later."
            : dialogType === "permanent"
              ? "This action cannot be undone. Are you sure you want to permanently delete this item?"
              : "Are you sure you want to activate this item?"
        }
        confirmText={
          dialogType === "soft"
            ? "Deactivate"
            : dialogType === "permanent"
              ? "Delete"
              : "Activate"
        }
      />
    </>
  );
};
