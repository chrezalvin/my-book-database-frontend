import { Image } from "react-bootstrap";

export interface ImageWithTitleProps{
    src: string;
    title: string;

    imgHeight?: number;
    imgWidth?: number;
}

export function ImageWithTitle(props: ImageWithTitleProps){
    return (
        <div
            className="d-flex"
        >
            <div
                className="me-2 d-flex justify-content-center"
                style={{
                    height: props.imgHeight ?? 40,
                    width: props.imgWidth ?? 40
                }}
            >
                <Image
                    src={props.src}
                    className="mh-100 mw-100"
                />
            </div>
            <p>{props.title}</p>
        </div>
    )
}