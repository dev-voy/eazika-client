"use server";

export async function getSignedUploadUrl(fileName: string, contentType: string) {
    try {
        const response = await fetch('http://localhost:8000/api/v2/uploads/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName,
                contentType
            })
        });

        if (!response.ok) {
            return { success: false, error: 'Failed to get upload URL' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error getting signed URL:', error);
        return { success: false, error: 'Failed to get upload URL' };
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
            body: file
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        return { success: true };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: 'Failed to upload file' };
    }
}

export async function getSignedUploadUrlsForMultiple(
    files: Array<{ fileName: string; contentType: string }>
) {
    try {
        const response = await fetch('http://localhost:8000/api/upload/multiple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files })
        });

        if (!response.ok) {
            return { success: false, error: 'Failed to get upload URLs' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error getting signed URLs:', error);
        return { success: false, error: 'Failed to get upload URLs' };
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
                    method: 'PUT',
                    headers: { 'Content-Type': data.contentType },
                    body: files[index]
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error('Error uploading multiple files:', error);
        return { success: false, error: 'Failed to upload files' };
    }
}
