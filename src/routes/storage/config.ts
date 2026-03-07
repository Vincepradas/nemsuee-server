export function shouldMakeUploadedFilesPublic() {
  return (
    (process.env.GOOGLE_DRIVE_PUBLIC_FILES || "").trim().toLowerCase() ===
    "true"
  );
}

export function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}
