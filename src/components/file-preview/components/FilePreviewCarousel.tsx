import type { ReactNode, ReactElement } from 'react';
import type { OnlineFile } from '@components/file-upload/types';
import type { IFileItem } from '../types.ts';

import { Children, isValidElement } from 'react';
import { fData } from '@common/utils/format-number.js';
import { fileExtractor } from '@components/file-preview/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Carousel, useCarousel, CarouselThumb, CarouselThumbs, CarouselArrowNumberButtons } from './carousel';

type Props = {
    children: ReactNode;
};

export function FilePreviewCarousel({ children }: Props) {
    const fileComponents = Children.toArray(children).filter(
        (child): child is ReactElement<IFileItem> => typeof child === 'object' && 'props' in child
    );
    const files = fileComponents.map((file) => file.props.file);

    const carousel = useCarousel({
        thumbs: {
            // axis: 'y',
            slideSpacing: '8px',
            slidesToShow: 'auto',
        },
    });

    return (
        <Stack sx={{ backgroundColor: 'transparent' }}>
            <Carousel carousel={carousel} sx={{ margin: 'inherit' }}>
                {fileComponents.map((child, i) => {
                    if (isValidElement(child)) {
                        return <CarouselItem key={i}>{child}</CarouselItem>;
                    }

                    return null;
                })}
            </Carousel>

            <CarouselDetail files={files} selectedIndex={carousel.dots.selectedIndex} />

            {files.length > 1 && (
                <CarouselArrowNumberButtons
                    {...carousel.arrows}
                    options={carousel.options}
                    totalSlides={carousel.dots.dotCount}
                    selectedIndex={carousel.dots.selectedIndex + 1}
                    sx={{ left: 16, bottom: 16, position: 'absolute' }}
                />
            )}

            {files.length > 1 && (
                <Box
                    sx={{
                        width: 'auto',
                        p: 0.5,
                        left: '50%',
                        bottom: -75,
                        // borderRadius: 1.25,
                        // bgcolor: 'primary.main',
                        position: 'absolute',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <CarouselThumbs
                        ref={carousel.thumbs.thumbsRef}
                        options={carousel.options?.thumbs}
                        sx={{ width: { xs: 1, sm: 1 } }}
                    >
                        {files.map((file, index) => {
                            const { extractedFileInfo } = fileExtractor({ file });

                            return (
                                <CarouselThumb
                                    key={index}
                                    index={index}
                                    fileInfo={extractedFileInfo}
                                    selected={index === carousel.thumbs.selectedIndex}
                                    onClick={() => carousel.thumbs.onClickThumb(index)}
                                    sx={{ width: 48, height: 48 }}
                                />
                            );
                        })}
                    </CarouselThumbs>
                </Box>
            )}
        </Stack>
    );
}

type CarouselItemProps = {
    children: ReactNode;
};

function CarouselItem({ children }: CarouselItemProps) {
    return <Stack sx={{ position: 'relative' }}>{children}</Stack>;
}

type CarouselDetailProps = {
    files: (File | OnlineFile)[];
    selectedIndex: number;
};

function CarouselDetail({ files, selectedIndex }: CarouselDetailProps) {
    const theme = useTheme();

    const fileInfos = files.map((file) => {
        const { extractedFileInfo } = fileExtractor({ file });
        return extractedFileInfo;
    });

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            gap={0.5}
            width={1}
            sx={{ position: 'absolute', top: -30, zIndex: -1 }}
        >
            <Typography color={theme.palette.common.white} sx={{ display: 'inline' }}>
                {fileInfos[selectedIndex].name}
            </Typography>
            <Typography color={theme.palette.grey.A400} variant="caption" sx={{ display: 'inline' }}>
                {fData(fileInfos[selectedIndex].size)}
            </Typography>
        </Stack>
    );
}
