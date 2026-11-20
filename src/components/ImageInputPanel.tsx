import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Panel } from '@/components/Panel';
import { Button } from '@/ui/Button';

export type SelectedImage = { file: File; url: string };

type Props = {
  image: SelectedImage | null;
  onFile: (file: File | null) => void;
};

const PC_MEDIA = '@media (min-width: 768px)';

const styles = stylex.create({
  dropzone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '72px',
    padding: '10px',
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: '#c7cbd4',
    borderRadius: '10px',
    backgroundColor: '#fafbfc',
    color: '#6d7482',
    fontSize: '12.5px',
    lineHeight: 1.6,
    textAlign: 'center',
    cursor: 'pointer',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '120ms',
    ':hover': {
      borderColor: '#4f46e5',
      backgroundColor: '#f5f6ff',
    },
    [PC_MEDIA]: {
      flexGrow: 1,
      fontSize: '13.5px',
    },
  },
  dropzoneActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef0ff',
  },
  previewArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '84px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e2e5eb',
    borderRadius: '10px',
    backgroundColor: '#fafbfc',
    overflow: 'hidden',
    cursor: 'pointer',
    [PC_MEDIA]: {
      position: 'relative',
      height: 'auto',
      flexGrow: 1,
      minHeight: 0,
    },
  },
  previewImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '6px',
    objectFit: 'contain',
    [PC_MEDIA]: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      padding: '8px',
      borderRadius: '10px',
    },
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '8px',
    flexShrink: 0,
    fontSize: '12px',
    color: '#5b6270',
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export function ImageInputPanel({ image, onFile }: Props) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <Panel title="カード画像" ariaLabel="カード画像入力">
      {image ? (
        <>
          <label htmlFor="card-image-input" {...stylex.props(styles.previewArea)}>
            <img src={image.url} alt="カード画像プレビュー" {...stylex.props(styles.previewImg)} />
          </label>
          <div {...stylex.props(styles.fileRow)}>
            <span {...stylex.props(styles.fileName)}>
              {image.file.name} ({formatBytes(image.file.size)})
            </span>
            <Button variant="ghost" onClick={() => onFile(null)}>
              クリア
            </Button>
          </div>
        </>
      ) : (
        <label
          htmlFor="card-image-input"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFile(e.dataTransfer.files[0] ?? null);
          }}
          {...stylex.props(styles.dropzone, dragOver && styles.dropzoneActive)}
        >
          <span>
            クリックして選択、またはドラッグ&ドロップ
            <br />
            PNG / JPEG / WebP
          </span>
        </label>
      )}
      <input
        id="card-image-input"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />
    </Panel>
  );
}
