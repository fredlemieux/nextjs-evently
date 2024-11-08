import { useCallback, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useDropzone } from '@uploadthing/react';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { CloudUploadIcon } from 'lucide-react';

import { convertFileToUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({
  imageUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
  });

  return (
    <div
      {...getRootProps()}
      className='flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-md bg-grey-50'
    >
      <input {...getInputProps()} className='cursor-pointer' />

      {imageUrl ? (
        <div className='flex h-full w-full flex-1 justify-center'>
          <Image
            src={imageUrl}
            alt='image'
            width={250}
            height={250}
            className='w-full object-cover object-center'
          />
        </div>
      ) : (
        <div className='flex-center flex-col py-5 text-grey-500'>
          <CloudUploadIcon className='h-20 w-20 stroke-gray-500' />
          <h3 className='mb-2 mt-2 text-gray-600'>Drag photo here</h3>
          <p className='p-medium-12 mb-4 text-gray-600'>SVG, PNG, or JPG</p>
          <Button type='button' className='rounded-md'>
            Select from device
          </Button>
        </div>
      )}
    </div>
  );
}
