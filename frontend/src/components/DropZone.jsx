import { useState } from "react";

// a dashed box you can drop an image onto, or click to choose one
function DropZone({ id, file, onFile, label }) {
    const [dragging, setDragging] = useState(false);

    function handleDrop(e){
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && dropped.type.startsWith("image/")){   // only pictures are accepted
            onFile(dropped);
        }
    }

    return (
        <label
            htmlFor={id}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`block px-4 py-4 rounded-xl border-2 border-dashed text-center text-sm cursor-pointer transition-colors ${dragging ? "border-muse-mauve bg-muse-pink/40" : "border-muse-pink bg-muse-cream hover:bg-muse-pink/20"} text-muse-dark`}
        >
            {file ? file.name : label}
            <input
                id={id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }}
            />
        </label>
    );
}

export default DropZone;