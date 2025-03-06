
import Image, { ImageProps } from 'next/image';

const NextImage = (props: ImageProps) => {
    return <Image {...props} alt={props.alt || ''} />;
    };
export default NextImage;