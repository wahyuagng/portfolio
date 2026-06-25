// import { useMemo, useState, useEffect, useCallback } from 'react';
// import { fileData, fileFormat, isOnlineFile, onlineFileFormat } from '@components/new-custom-grid/form/file-upload/utils';
//
// interface FileInfo {
//   name: string;
//   path?: string;
//   url: string;
//   format: string;
// }
//
// export function useExtractFile(file: string | File) {
//   const { path, name } = fileData(file);
//
//   const url = typeof file === 'string' ? file : URL.createObjectURL(file);
//
//   const defaultFileInfo: FileInfo = useMemo(
//     () => ({
//       name,
//       path,
//       url,
//       format: '',
//     }),
//     []
//   );
//
//   const [fileInfo, setFileInfo] = useState<FileInfo>(defaultFileInfo);
//   const [isExtracting, setIsExtracting] = useState<boolean>(false);
//
//   useEffect(() => {
//     setIsExtracting(true);
//
//     if (isOnlineFile(url)) {
//       (async function extract() {
//         await extractOnlineFile(url);
//       })();
//     } else {
//       extractOfflineFile(url);
//     }
//   }, []);
//
//   const extractOnlineFile = useCallback(async (url: string) => {
//     const format = await onlineFileFormat(url);
//
//     setFileInfo((prevState) => ({
//       ...prevState,
//       format: format || '',
//     }));
//
//     setIsExtracting(false);
//   }, []);
//
//   const extractOfflineFile = useCallback((url: string) => {
//     const format = fileFormat(path || url);
//
//     setFileInfo((prevState) => ({
//       ...prevState,
//       format: format || '',
//     }));
//
//     setIsExtracting(false);
//   }, []);
//
//   return { ...fileInfo, isExtracting };
// }
