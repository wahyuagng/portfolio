import Stack from '@mui/material/Stack';

interface Props {
    url: string;
}

export function AudioPreview({ url }: Props) {
    return (
        <Stack direction="row" justifyContent="center" sx={{ width: 1 }}>
            <audio
                controls
                controlsList="odownload"
                onCanPlayThrough={() => console.log('ok')}
                style={{
                    width: '100%',
                    height: '50px',
                    pointerEvents: 'auto',
                }}
            >
                <source src={url} type="audio/mp3" />
                <track kind="caption" src="" label="English" default />
                Your browser doesn&apos;t support the audio element
            </audio>
        </Stack>
    );
}
