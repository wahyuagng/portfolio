import type { EmblaPluginType } from 'embla-carousel';
import type { CarouselOptions, UseCarouselReturn } from '../types.ts';

import { useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import { useThumbs } from './use-thumbs';
import { useCarouselDots } from './use-carousel-dots';
import { useParallax } from './use-carousel-parallax';
import { useCarouselArrows } from './use-carousel-arrows';
import { useCarouselProgress } from './use-carousel-progress';

export const useCarousel = (options?: CarouselOptions, plugins?: EmblaPluginType[]): UseCarouselReturn => {
    const [mainRef, mainApi] = useEmblaCarousel(options, plugins);

    const { disablePrev, disableNext, onClickPrev, onClickNext } = useCarouselArrows(mainApi);

    const pluginNames = plugins?.map((plugin) => plugin.name);

    const _dots = useCarouselDots(mainApi);

    const _progress = useCarouselProgress(mainApi);

    const _thumbs = useThumbs(mainApi, options?.thumbs);

    useParallax(mainApi, options?.parallax);

    const controls = useMemo(
        () => ({
            onClickPrev,
            onClickNext,
        }),
        [onClickNext, onClickPrev, pluginNames]
    );

    return {
        options: {
            ...options,
            ...mainApi?.internalEngine().options,
        },
        pluginNames,
        mainRef,
        mainApi,
        // arrows
        arrows: {
            disablePrev,
            disableNext,
            onClickPrev: controls.onClickPrev,
            onClickNext: controls.onClickNext,
        },
        // dots
        dots: _dots,
        // thumbs
        thumbs: _thumbs,
        // progress
        progress: _progress,
    };
};
