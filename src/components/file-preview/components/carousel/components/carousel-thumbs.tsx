import type { BoxProps } from '@mui/material/Box';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { CarouselThumbProps, CarouselThumbsProps } from '../types';

import { Children, forwardRef, isValidElement } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { carouselClasses } from '../classes';
import { CarouselSlide } from './carousel-slide';
import { StyledRoot, StyledContainer } from '../carousel';
import { fileThumb, fileFormat } from '../../../../file-upload/utils';
import { fileThumbnailClasses } from '../../../../file-upload/classes';

export const CarouselThumbs = forwardRef<HTMLDivElement, BoxProps & CarouselThumbsProps>(
    ({ children, slotProps, options, sx, className, ...other }, ref) => {
        const axis = options?.axis ?? 'x';

        const slideSpacing = options?.slideSpacing ?? '12px';

        const renderChildren = Children.map(children, (child) => {
            if (isValidElement(child)) {
                const reactChild = child as React.ReactElement<{ key?: React.Key }>;

                return (
                    <CarouselSlide key={reactChild.key} options={{ ...options, slideSpacing }} sx={slotProps?.slide}>
                        {child}
                    </CarouselSlide>
                );
            }
            return null;
        });

        return (
            <StyledRoot
                ref={ref}
                axis={axis}
                className={carouselClasses.thumbs.concat(className ? ` ${className}` : '')}
                sx={{
                    flexShrink: 0,
                    ...(axis === 'x' && { p: 0.5, maxWidth: 1 }),
                    ...(axis === 'y' && { p: 0.5, maxHeight: 1 }),
                    // ...(!slotProps?.disableMask && maskStyles),
                    ...sx,
                }}
                {...other}
            >
                <StyledContainer
                    // component="ul"
                    axis={axis}
                    slideSpacing={slideSpacing}
                    className={carouselClasses.thumbContainer}
                    sx={{
                        ...slotProps?.container,
                    }}
                >
                    {renderChildren}
                </StyledContainer>
            </StyledRoot>
        );
    }
);

export function CarouselThumb({
    sx,
    index,
    selected,
    className,
    fileInfo,
    ...other
}: ButtonBaseProps & CarouselThumbProps) {
    const format = fileFormat(fileInfo.name);

    return (
        <ButtonBase
            className={carouselClasses.thumb.concat(className ? ` ${className}` : '')}
            sx={{
                width: 64,
                height: 64,
                opacity: 0.48,
                flexShrink: 0,
                cursor: 'pointer',
                borderRadius: 1.25,
                transition: (theme) =>
                    theme.transitions.create(['opacity', 'box-shadow'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.short,
                    }),
                ...(selected && {
                    opacity: 1,
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
                }),
                ...sx,
            }}
            {...other}
        >
            {fileInfo.thumbnail ? (
                <Box
                    component="img"
                    alt={`carousel-thumb-${index}`}
                    src={fileInfo.thumbnail}
                    className={carouselClasses.thumbImage}
                    sx={{
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                        borderRadius: 'inherit',
                    }}
                />
            ) : (
                <Box
                    component="img"
                    src={fileThumb(format)}
                    className={fileThumbnailClasses.icon}
                    sx={{ width: 1, height: 1 }}
                />
            )}
        </ButtonBase>
    );
}
