import axios, { isAxiosError } from "./axios";

type UploadProductResult = Promise<
  { success: true; urls: string[] } | { success: false; message: string }
>;

type UploadProfilePicResult = Promise<
  { success: true; url: string } | { success: false; message: string }
>;

async function uploadProfilePic(file: File): UploadProfilePicResult {
  if (file.size > 5 * 1024 * 1024)
    throw new Error(`File ${file.name} exceeds the 5MB size limit.`);

  try {
    const { data } = await axios.post("/uploads/profile-picture", {
      file: `users/${Date.now()}-${file.name.slice(-10)}-${Math.floor(
        Math.random() * 1000
      )}.${file.type}`,
    });

    if (!data.signedUrl)
      throw new Error("Failed to get upload URL from the server.");
    const uploadedImgages = await fetch(data.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: file,
    });

    const { date } = await uploadedImgages.json();

    return { success: true, url: date };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } else if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
}
async function uploadProductImage(files: FileList): UploadProductResult {
  if (files.length === 0 || files.length > 5)
    throw new Error("Please upload between 1 to 5 files.");
  const payload: string[] = [];
  try {
    Array.from(files).map((file) => {
      if (file.size > 5 * 1024 * 1024)
        throw new Error(`File ${file.name} exceeds the 5MB size limit.`);
      payload.push(
        `products/${Date.now()}-${file.name.slice(-10)}-${Math.floor(
          Math.random() * 1000
        )}.${file.type}`
      );
    });
    const { data } = await axios.post("/uploads/product-images", {
      files: payload,
    });

    if (!data.signedUrl)
      throw new Error("Failed to get upload URL from the server.");

    // Build a FormData from the FileList and let the browser set the Content-Type boundary.
    const form = new FormData();
    Array.from(files).forEach((file) => form.append("files", file));

    const uploadedImgages = await fetch(data.signedUrl, {
      method: "POST",
      body: form,
    });
    const { date } = await uploadedImgages.json();
    return { success: true, urls: date };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } else if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
}
export { uploadProductImage, uploadProfilePic };
