import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export default function SimpleDialog({ onClose, open, message}) {

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{message}</DialogTitle>
    </Dialog>
  );
}