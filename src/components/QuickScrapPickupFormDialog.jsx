import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";


const QuickScrapPickupFormDialog = ({ open, onClose }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register for Scrap Pickup</DialogTitle>
      <DialogContent>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          Close
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickScrapPickupFormDialog;
