import cn from 'classnames';
import { useEffect, useState } from 'react';
import styles from '../styles/layout.module.scss';
import Typography from '@mui/material/Typography';
import { TextField, Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function SignUp() {
  const [generalError, setGeneralError] = useState('');
  const [open, setOpen] = useState(false);

  const handleRedirect = () => {
    if (window) {
      window.location.href = '/signin';
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate: values => {
      setGeneralError('');
      const errors = {};
      if (!values.email) {
        errors.email = 'Requerido';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Dirección de e-mail inválida';
      }
      if (!values.password) {
        errors.password = 'Requerido';
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/register`, values)
      .then(function (response) {
        setOpen(true);
        setSubmitting(false);
      })
      .catch(function ({ message, response: { data: { detail } } }) {
        if (detail) {
          setGeneralError(detail);
        } else {
          setGeneralError(message);
        }
        setSubmitting(false);
      });
    },
  });

  return (
    <Box pt={9} className={styles.formPage}>
      <Typography variant="h4" noWrap component="h1" className={styles.formTitle} sx={{marginBottom: 3}}>
        🇨🇴 Colombian Sentiment Analysis
      </Typography>
      <Typography variant="h5" noWrap component="h2" className={styles.formTitle}>
        Crear Cuenta
      </Typography>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <TextField
          id="user-input"
          label="Email"
          variant="standard"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email && (
          <Typography variant="body2" color="error" noWrap component="div" className={styles.formError}>
            {formik.errors.email}
          </Typography>
        )}
        <TextField
          id="password-input"
          label="Contraseña"
          type="password"
          variant="standard"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password && (
          <Typography variant="body2" color="error" noWrap component="div" className={styles.formError}>
            {formik.errors.password}
          </Typography>
        )}
        <Box mt={2} />
        <Button variant='contained' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Enviando...' : 'Crear'}
        </Button>
        <Box mt={2} display="flex" justifyContent="flex-end">
          ¿Ya tienes cuenta?&nbsp;<Link href="/signin">
            <a>Iniciar Sesión</a>
          </Link>
        </Box>
        {generalError.length > 0 ? (
          <Typography variant="body2" color="error" noWrap component="div" className={styles.formError}>
            Error: {generalError}
          </Typography>
        ):  null}
      </form>
      <Dialog
        open={open}
        onClose={handleRedirect}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Usuario creado
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Su usuario ha sido creado. Se le redirigirá al formulario de inicio de sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRedirect} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
