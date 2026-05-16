import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import UploadIcon from '../../../assets/File_dock_add.svg?react'; // заміни на свій SVG

// ─── FileDropzone ─────────────────────────────────────────────────────────────
//
// Props:
//   value:    File | null     — контрольований стан файлу
//   onChange: (File|null)=>void
//   accept:   string          — напр. "image/*"
//   label:    string          — лейбл зверху
//   error:    string | null

const FileDropzone = ({
  value,
  onChange,
  accept = 'image/*',
  label,
  error,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [typeError, setTypeError] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const isValidType = (file) => {
    if (!accept) return true;
    return accept
      .split(',')
      .map((s) => s.trim())
      .some((pattern) => {
        if (pattern.startsWith('.')) {
          return file.name.toLowerCase().endsWith(pattern.toLowerCase());
        }
        if (pattern.endsWith('/*')) {
          return file.type.startsWith(pattern.replace('/*', '/'));
        }
        return file.type === pattern;
      });
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!isValidType(file)) {
      setTypeError(`Непідтримуваний формат. Дозволено: ${accept}`);
      return;
    }

    setTypeError(null);
    onChange(file);
  };

  const handleInputChange = (e) => handleFiles(e.target.files);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}

      <DropZone
        $isDragging={isDragging}
        $hasFile={!!value}
        $hasError={!!error}
        onClick={() => !value && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <PreviewWrapper>
            <PreviewImage src={previewUrl} alt="Прев'ю обкладинки" />
            <RemoveOverlay onClick={handleRemove} type="button">
              Видалити
            </RemoveOverlay>
          </PreviewWrapper>
        ) : (
          <EmptyState>
            <UploadIcon width={40} height={40} />
            <EmptyText>
              {isDragging
                ? 'Відпустіть файл'
                : 'Натисніть або перетягніть файл'}
            </EmptyText>
          </EmptyState>
        )}
      </DropZone>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
      />
      {(typeError || error) && <ErrorText>{typeError ?? error}</ErrorText>}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
`;

const Label = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 0.875rem;
  color: var(--grey-100, #959595);
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  display: block;
`;

// Оверлей при хавер на прев'ю
const RemoveOverlay = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${PreviewWrapper}:hover & {
    opacity: 1;
  }
`;

const DropZone = styled.div`
  position: relative;
  width: 100%;
  min-height: 10rem;
  border-radius: 0.75rem;
  border: 2px dashed
    ${({ $hasError, $isDragging }) =>
      $hasError
        ? 'var(--brick-red-100, #E42939)'
        : $isDragging
          ? 'var(--accent-color)'
          : 'var(--base-bright-grey, #e7eef3)'};

  background-color: ${({ $isDragging }) =>
    $isDragging ? 'rgba(0,0,0,0.03)' : 'transparent'};

  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: ${({ $hasFile }) =>
      $hasFile ? 'transparent' : 'var(--grey-40, #cbd5e1)'};
  }

  ${PreviewWrapper} {
    pointer-events: none;
  }

  ${RemoveOverlay} {
    pointer-events: auto;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--grey-100, #6b6b6b);
  height: 100%;
  min-height: 10rem;
`;

const EmptyText = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
`;



const HiddenInput = styled.input`
  display: none;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100, #e42939);
  margin: 0;
`;

export default FileDropzone;
