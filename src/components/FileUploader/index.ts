import { FileUploader } from './ui/FileUploader/FileUploader';
import { Form } from './ui/Form/Form';
import { Response } from './ui/Response/Response';

import { ClearButton } from './ui/ClearButton/ClearButton';
import { UploadButton } from './ui/UploadButton/UploadButton';
import { FileDragInput } from './ui/FileDragInput/FileDragInput';
import { NameInput } from './ui/NameInput/NameInput';
import { Progress } from './ui/Progress/Progress';
import { TextGuide } from './ui/TextGuide/TextGuide';
import { CloseButton } from './ui/CloseButton/CloseButton';

FileUploader.define('file-uploader');
CloseButton.define('file-uploader-close-button');

Form.define('file-uploader-form');
Response.define('file-uploader-response');

ClearButton.define('file-uploader-clear-button');
FileDragInput.define('file-uploader-file-drag-input');
NameInput.define('file-uploader-name-input');
Progress.define('file-uploader-progress');
TextGuide.define('file-uploader-text-guide');

UploadButton.define('file-uploader-upload-button');
