import { fileExtractor } from '../utils';
import { type IFileItem } from '../types';
import { PdfPreview } from './PDFPreview';
import { AudioPreview } from './AudioPreview';
import { GdocsPreview } from './GdocsPreview';
import { ImagePreview } from './ImagePreview';
import { VideoPreview } from './VideoPreview';
import { OfficePreview } from './OfficePreview';
import { LocalOfficeViewer } from './LocalOfficeViewer';
import { NotSupportedPreview } from './NotSupportedPreview';

interface Props extends IFileItem {}

export function Previewer({ file }: Props) {
    const { extractedFile, extractedFileInfo } = fileExtractor({ file });

    const url = extractedFile instanceof File ? URL.createObjectURL(extractedFile) : extractedFile;
    switch (extractedFileInfo.format) {
        case 'image':
            return <ImagePreview url={url} />;
        case 'audio':
            return <AudioPreview url={url} />;
        case 'video':
            return <VideoPreview url={url} />;
        case 'pdf':
            return <PdfPreview file={file} />;
        case 'office':
            return <LocalOfficeViewer file={file as File} />;
        case 'online-office':
            return <OfficePreview fileUrl={url} />;
        case 'online-pdf':
            return <GdocsPreview fileUrl={url} />;
        default:
            /** Not Supported File Formats:
             * Offline .csv .doc .ppt .pptx
             * Online .csv
             * */
            return <NotSupportedPreview fileUrl={url} fileName={extractedFileInfo.name} format={extractedFileInfo.format} />;
    }
}
