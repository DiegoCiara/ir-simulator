import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { X } from 'lucide-react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  // bgcolor: 'var(--modal-background)',
  // border: '2px solid #000',
  // borderRadius: '7px',
  boxShadow: 14,
  // p: 4,
  outline: 'none',
};

interface ModalContainerProps {
  open: boolean;
  close: () => void;
  children?: React.ReactNode; // Permite passar JSX ou texto como children
  [key: string]: any; // Para suportar outros parâmetros opcionais, como `sx` ou `aria` attributes
}

export default function ModalContainer({
  open,
  close,
  children,
  ...params
}: ModalContainerProps) {
  const handleClose = (
    // event: React.SyntheticEvent | Event,
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    if (reason === 'backdropClick') return;
    close();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        {...params}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            },
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <X className="absolute top-5 right-5 closemodal" onClick={close} />
            {children}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
