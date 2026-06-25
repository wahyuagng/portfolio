import Stack from '@mui/material/Stack';

type Props = {
    fileUrl: string;
};

export const OfficePreview = ({ fileUrl }: Props) => (
    <Stack justifyContent="center" height="80vh" padding={2}>
        <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
            style={{ width: '100%', height: '600px' }}
            title="Office Document Viewer"
        />
    </Stack>
);
