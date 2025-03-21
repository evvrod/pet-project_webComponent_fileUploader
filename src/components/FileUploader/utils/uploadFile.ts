interface IFileUploadOptions {
  file: File | undefined;
  name: string | undefined;
}

export interface IUploadSuccessResponse {
  message: string;
  filename: string;
  nameField: string;
  timestamp: string;
}

export interface IUploadError {
  status: string;
  message: string;
  details?: string;
}

export type IUploadFileResponse = {
  data?: IUploadSuccessResponse;
  error?: IUploadError;
};

export async function uploadFile({
  file,
  name,
}: IFileUploadOptions): Promise<IUploadFileResponse> {
  // const apiUrl = 'https://file-upload-server-mc26.onrender.com/api/v1/upload';
  try {
    if (!file || !name) {
      throw new UploadError(400, 'File and name are required');
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // throw new UploadError(400, 'File and name are required');

    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('name', name);

    // const response = await fetch(apiUrl, {
    //   method: 'POST',
    //   body: formData,
    // });

    // const result = await response.json();

    // if (!response.ok) {
    //   throw new UploadError(response.status, result.error, result.details);
    // }

    const result = {
      message: 'File uploaded successfully',
      filename: 'example.jpg',
      nameField: 'John Doe',
      timestamp: '2023-08-01T12:00:00Z',
    }

    return { data: result };
  } catch (error) {
    if (error instanceof UploadError) {
      return {
        error: {
          status: error.status,
          message: error.message,
          details: error.details,
        },
      };
    } else {
      return {
        error: {
          status: '500 Internal Server Error',
          message: 'Internal Server Error',
          details: String(error),
        },
      };
    }
  }
}

class UploadError extends Error {
  status: string;
  details?: string;

  constructor(statusCode: number, message: string, details?: string) {
    super(message);
    if (statusCode >= 400 && statusCode < 500) this.status = '400 Bad Request';
    else this.status = '500 Internal Server Error';
    this.details = details;
  }
}
