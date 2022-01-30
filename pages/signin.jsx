import cn from 'classnames';
import { useEffect, useState } from 'react';
import styles from '../styles/layout.module.scss';
import Typography from '@mui/material/Typography';
import { TextField, Box, Button } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link'
import axios from 'axios';

export default function SignIn() {
  const [generalError, setGeneralError] = useState('');

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
      const formData = new FormData();
      formData.append('username', values.email);
      formData.append('password', values.password);
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/token`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(function ({ data: {access_token, token_type} }) {
        if(window) {
          window.localStorage.setItem('access_token', access_token);
          window.localStorage.setItem('token_type', token_type);
          window.location.href = '/';
        }
      })
      .catch(function ({ message, response: { data: { detail } } }) {
        if (detail === 'Unauthorized') {
          setGeneralError('Usuario o contraseña incorrectos.');
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
        Iniciar Sesión
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
        {formik.touched.email && Boolean(formik.errors.email) && (
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
        {formik.touched.password && Boolean(formik.errors.password) && (
          <Typography variant="body2" color="error" noWrap component="div" className={styles.formError}>
            {formik.errors.password}
          </Typography>
        )}
        <Box mt={2} />
        <Button variant='contained' type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Enviando...' : 'Crear'}
        </Button>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Link href="/signup">
            <a>Crear nueva cuenta</a>
          </Link>
        </Box>
        {generalError.length > 0 ? (
          <Typography variant="body2" color="error" noWrap component="div" className={styles.formError}>
            Error: {generalError}
          </Typography>
        ):  null}
      </form>
    </Box>
  );
}
