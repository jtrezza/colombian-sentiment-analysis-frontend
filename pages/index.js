import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box, Button, CircularProgress} from '@mui/material';

export default function Index() {

  const [isLoading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [rows, setRows] = useState([]);

  const loadMore = () => {
    const token_type = localStorage.getItem('token_type');
    const access_token = localStorage.getItem('access_token');
    if (!access_token || !token_type) {
      location.href = '/signin';
    }
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/data_clean/?skip=${skip}&limit=${limit}`, {
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    }).then(({data}) => {
        setRows(rows.concat(
          data.map(r => ({id: r.id, content: r.content, date: r.date, aprox_city: r.aprox_city}))
        ));
        setSkip(skip + 50);
        setLoading(false);
      });
  }

  useEffect(() => {
    const token_type = localStorage.getItem('token_type');
    const access_token = localStorage.getItem('access_token');
    if (!access_token || !token_type) {
      location.href = '/signin';
    }
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/data_clean/?skip=${skip}&limit=${limit}`, {
      headers: {
        'Authorization': `${token_type} ${access_token}`
      }
    }).then(({data}) => {
        setRows(data.map(r => ({id: r.id, content: r.content, date: r.date, aprox_city: r.aprox_city})))
        setSkip(skip + 50);
        setLoading(false);
      });
  }, []);
  
  return (
    <div style={{ height: 'calc(90vh - 64px)', width: '100%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Content</TableCell>
              <TableCell align="right">Aprox. City</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.content}</TableCell>
                <TableCell align="right">{row.aprox_city}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ): null}
      <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '30px', paddingBottom: '30px'}}>
        <Button variant="contained" onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Cargar Más'}
        </Button>
      </Box>
    </div>
  );
}
