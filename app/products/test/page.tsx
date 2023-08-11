"use client"

import React, { useState } from 'react';

const ImageUploader: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    setImageFiles(prevFiles => [...prevFiles, ...files]);
    console.log(imageFiles)
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
    >
      <h2>Arrastra imágenes aquí</h2>
      {imageFiles.map((file, index) => (
        <div key={index}>
          <img src={URL.createObjectURL(file)} alt={`Imagen ${index}`} style={{ maxWidth: '100px' }} />
        </div>
      ))}
    </div>
  );
};

export default ImageUploader;