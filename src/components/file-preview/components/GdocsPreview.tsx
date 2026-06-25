import Stack from '@mui/material/Stack';

type Props = {
    fileUrl: string;
};

export const GdocsPreview = ({ fileUrl }: Props) => (
    <Stack justifyContent="center" height="80vh" padding={2}>
        <iframe
            title={fileUrl}
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            style={{ width: '100%', height: '600px' }}
        />
    </Stack>
);
