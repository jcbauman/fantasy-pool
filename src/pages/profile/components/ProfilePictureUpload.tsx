// ProfileUpload.tsx
import React, { useState } from "react";
import { uploadProfilePicture } from "../../../backend/firebase/storage";
import { Button, CircularProgress } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { sendErrorNotification } from "../../../shared-components/toasts/notificationToasts";

type Props = {
  playerId: string;
  onUpload: (url: string) => void;
};

export const ProfileUpload: React.FC<Props> = ({ playerId, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        const url = await uploadProfilePicture(file, playerId);
        onUpload(url);
      } catch (err) {
        sendErrorNotification("Could not upload profile picture");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="upload-button-file"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="upload-button-file">
        <Button
          variant="contained"
          color="primary"
          component="span"
          aria-label="upload profile picture"
        >
          {uploading ? <CircularProgress /> : <FileUploadOutlinedIcon />}
        </Button>
      </label>
    </>
  );
};
