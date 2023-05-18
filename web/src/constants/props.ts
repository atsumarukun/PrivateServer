export interface FileProps {
  Name: string;
  MimeType: string;
}

export interface StorageProps {
  files: FileProps[];
}
