import type { ExtendFile, OnlineFile } from './types';

import { CONFIG } from '../../global-config';

// import { MediaService } from '../../../../../services/media/modules/MediaService.ts';

const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx', 'csv'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'JPG'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];
const FORMAT_REACT_OFFICE_LIBRARY = ['docx', 'xls', 'xlsx'];

const FORMAT_MIME_OFFICE_LIBRARY = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const FORMAT_MIME_AUDIO = ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/aac', 'audio/flac'];
const FORMAT_MIME_VIDEO = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/x-msvideo'];
const FORMAT_MIME_IMAGE = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'image/bmp',
    'image/tiff',
];
const FORMAT_MIME_PDF = ['application/pdf'];

const iconUrl = (icon: string) => `${CONFIG.assetsDir}/assets/icons/files/${icon}.svg`;

export function fileFormat(fileUrl: string | undefined, isOnline?: boolean) {
    let format;

    switch (fileUrl?.includes(fileTypeByUrl(fileUrl))) {
        case FORMAT_REACT_OFFICE_LIBRARY.includes(fileTypeByUrl(fileUrl)):
            format = isOnline ? 'online-office' : 'office';
            break;
        case FORMAT_PDF.includes(fileTypeByUrl(fileUrl)):
            format = isOnline ? 'online-pdf' : 'pdf';
            break;
        case FORMAT_TEXT.includes(fileTypeByUrl(fileUrl)):
            format = 'txt';
            break;
        case FORMAT_ZIP.includes(fileTypeByUrl(fileUrl)):
            format = 'zip';
            break;
        case FORMAT_AUDIO.includes(fileTypeByUrl(fileUrl)):
            format = 'audio';
            break;
        case FORMAT_IMG.includes(fileTypeByUrl(fileUrl)):
            format = 'image';
            break;
        case FORMAT_VIDEO.includes(fileTypeByUrl(fileUrl)):
            format = 'video';
            break;
        case FORMAT_WORD.includes(fileTypeByUrl(fileUrl)):
            format = 'word';
            break;
        case FORMAT_EXCEL.includes(fileTypeByUrl(fileUrl)):
            format = 'excel';
            break;
        case FORMAT_POWERPOINT.includes(fileTypeByUrl(fileUrl)):
            format = 'powerpoint';
            break;
        case FORMAT_PHOTOSHOP.includes(fileTypeByUrl(fileUrl)):
            format = 'photoshop';
            break;
        case FORMAT_ILLUSTRATOR.includes(fileTypeByUrl(fileUrl)):
            format = 'illustrator';
            break;
        default:
            format = 'image';
    }

    return format;
}

// export function isOnlineFile(fileUrl?: string): boolean {
//   if (!fileUrl) return false;
//
//   return fileUrl.startsWith('https://');
// }

export function extractId(url?: string): string | null {
    if (!url) return null;

    const match = url.match(/\/file\/([^/]+)/);
    return match ? match[1] : null;
}

export async function onlineFileFormat(fileUrl?: string) {
    return false;
    // const mediaService = new MediaService();
    // const id = extractId(fileUrl);
    //
    // if (!id) {
    //   return null;
    // }
    //
    // try {
    //   const mime = await mediaService.getMIME(id);
    //
    //   switch (true) {
    //     case FORMAT_MIME_OFFICE_LIBRARY.includes(mime):
    //       return 'online-office';
    //     case FORMAT_MIME_PDF.includes(mime):
    //       return 'online-pdf';
    //     case FORMAT_MIME_AUDIO.includes(mime):
    //       return 'audio';
    //     case FORMAT_MIME_VIDEO.includes(mime):
    //       return 'video';
    //     case FORMAT_MIME_IMAGE.includes(mime):
    //       return 'image';
    //     default:
    //       return 'other';
    //   }
    // } catch (e) {
    //   return 'other';
    //   console.error(e);
    // }
}

export function fileThumb(fileUrl: string) {
    let thumb;

    switch (fileUrl) {
        case 'office':
            thumb = iconUrl('ic-excel');
            break;
        case 'folder':
            thumb = iconUrl('ic-folder');
            break;
        case 'txt':
            thumb = iconUrl('ic-txt');
            break;
        case 'zip':
            thumb = iconUrl('ic-zip');
            break;
        case 'audio':
            thumb = iconUrl('ic-audio');
            break;
        case 'video':
            thumb = iconUrl('ic-video');
            break;
        case 'word':
            thumb = iconUrl('ic-word');
            break;
        case 'excel':
            thumb = iconUrl('ic-excel');
            break;
        case 'powerpoint':
            thumb = iconUrl('ic-power_point');
            break;
        case 'pdf':
            thumb = iconUrl('ic-pdf');
            break;
        case 'photoshop':
            thumb = iconUrl('ic-pts');
            break;
        case 'illustrator':
            thumb = iconUrl('ic-ai');
            break;
        case 'image':
            thumb = iconUrl('ic-img');
            break;
        default:
            thumb = iconUrl('ic-file');
    }
    return thumb;
}

export function fileTypeByUrl(fileUrl = '') {
    return (fileUrl && fileUrl.split('.').pop()) || '';
}

export function fileNameByUrl(fileUrl: string) {
    return fileUrl.split('/').pop();
}

export function fileData(file: ExtendFile | OnlineFile) {
    if (file instanceof File) {
        // File
        return {
            key: file.preview,
            name: file.name,
            size: file.size,
            path: file.path,
            type: file.type,
            preview: file.preview,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
        };
    }

    // Url
    return {
        key: file,
        preview: file.SignedUrl,
        name: file.Name,
        size: file.Size,
        type: file.Extension,
    };
}

export const formatChecker = (format: string) => {
    if (format !== 'audio' && format !== 'video' && format !== 'image' && format !== 'pdf') {
        return 'office';
    }

    return format;
};

export const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');

    link.href = fileUrl;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);

    link.click();
    link.remove();

    window.URL.revokeObjectURL(fileUrl);
};
