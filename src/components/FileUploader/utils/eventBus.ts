import { IUploadFileResponse } from './uploadFile';

export enum EventType {
  AddName = 'add-name',
  RemoveName = 'remove-name',
  SelectFile = 'select-file',
  SelectFileError = 'select-file-error',
  DeselectFile = 'deselect-file',
  ReadFile = 'read-file',
  GetResponse = 'get-response',
  UpdateProgress = 'update-progress',
  UploadStart = 'upload-start',
  UploadEnd = 'upload-end',
  Init = 'init',
}

export const eventBus = new EventTarget();

// Типизируем кастомные события
export type CustomEventMap = {
  [EventType.Init]: CustomEvent<void>;
  [EventType.AddName]: CustomEvent<string>;
  [EventType.RemoveName]: CustomEvent<void>;
  [EventType.SelectFile]: CustomEvent<File>;
  [EventType.SelectFileError]: CustomEvent<File>;
  [EventType.DeselectFile]: CustomEvent<File>;
  [EventType.ReadFile]: CustomEvent<File>;
  [EventType.GetResponse]: CustomEvent<IUploadFileResponse>;
  [EventType.UpdateProgress]: CustomEvent<number>;
  [EventType.UploadStart]: CustomEvent<void>;
  [EventType.UploadEnd]: CustomEvent<IUploadFileResponse>;
};

export type CustomEventListener<K extends keyof CustomEventMap> = (
  event: CustomEventMap[K],
) => void;

export function addEvent<K extends keyof CustomEventMap>(
  event: K,
  handler: CustomEventListener<K>,
  options?: AddEventListenerOptions,
) {
  eventBus.addEventListener(event, handler as EventListener, options);
}

export function removeEvent<K extends keyof CustomEventMap>(
  event: K,
  handler: CustomEventListener<K>,
) {
  eventBus.removeEventListener(event, handler as EventListener);
}

export function dispatchEvent<K extends keyof CustomEventMap>(
  event: K,
  detail?: CustomEventMap[K]['detail'],
) {
  const customEvent = new CustomEvent(event, {
    detail: detail,
  });
  eventBus.dispatchEvent(customEvent);
}
