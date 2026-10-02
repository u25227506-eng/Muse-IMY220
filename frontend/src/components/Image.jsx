function Image({src, alt}){
    return <img src={src} alt={alt} className="rounded-xl w-full max-h-96 object-cover" />;
}

export default Image;