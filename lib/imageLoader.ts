interface LoaderProps {
    src: string;
    width: number;
    quality?: number;
}

const imageLoader = ({ src, width, quality }: LoaderProps): string => {
    return `${src}?w=${width}&q=${quality || 75}`;
};

export default imageLoader;