interface IFileUploadOptions {
  file: File | undefined;
  name: string | undefined;
  abortSignal?: AbortSignal;
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
  abortSignal,
}: IFileUploadOptions): Promise<IUploadFileResponse> {
  const apiUrl = 'https://file-upload-server-mc26.onrender.com/api/v1/upload';

  const controller = new AbortController();
  const signal = abortSignal || controller.signal;
  try {
    if (!file || !name) {
      throw new UploadError(400, 'Необходимы файл и имя');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      signal, // Передаем сигнал в fetch
    });

    const result = await response.json();

    if (!response.ok) {
      throw new UploadError(response.status, result.error, result.details);
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
