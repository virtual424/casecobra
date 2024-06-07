export async function uploadFileAction(acceptedFiles: File[]): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", acceptedFiles[0]);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return await response.json();
}
