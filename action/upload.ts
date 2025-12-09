"use server";

const serverUri = process.env.SERVER_URI || "https://server.eazika.com";

export const uploadImage = async (file: File) => {
  try {
    const contentType = file.type;
    const fileName = `image-${Date.now()}-${Math.floor(Math.random() * 1000)}.${
      contentType.split("/")[1]
    }`;

    // Step 1: Get signed upload URL from backend
    const signedUrlResponse = await getSignedUploadUrl(fileName, contentType);
    if (!signedUrlResponse.success)
      return { success: false, error: signedUrlResponse.error };

    const { signedUrl, publicUrl, instructions } = signedUrlResponse.data;

    // Step 2: Upload the file to the signed URL
    const uploadResponse = await uploadFileToSignedUrl(
      signedUrl,
      file,
      instructions
    );
    if (!uploadResponse.success)
      return { success: false, error: uploadResponse.error };

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return { success: false, error: "Failed to upload image" };
  }
};

export async function getSignedUploadUrl(
  fileName: string,
  contentType: string
) {
  try {
    const response = await fetch(`${serverUri}/api/V2/uploads/avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        contentType,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to get upload URL" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return { success: false, error: "Failed to get upload URL" };
  }
}

export async function uploadFileToSignedUrl(
  signedUrl: string,
  file: File,
  instructions: { method: string; headers: Record<string, string> }
) {
  try {
    const response = await fetch(signedUrl, {
      method: instructions.method,
      headers: instructions.headers,
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return { success: true };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export async function getSignedUploadUrlsForMultiple(
  files: Array<{ fileName: string; contentType: string }>
) {
  try {
    const response = await fetch(`${serverUri}/api/V2/uploads/multiple`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to get upload URLs" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error getting signed URLs:", error);
    return { success: false, error: "Failed to get upload URLs" };
  }
}

export async function uploadMultipleFilesToSignedUrls(
  uploadData: Array<{ signedUrl: string; contentType: string }>,
  files: File[]
) {
  try {
    await Promise.all(
      uploadData.map((data, index) =>
        fetch(data.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": data.contentType },
          body: files[index],
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    return { success: false, error: "Failed to upload files" };
  }
}
