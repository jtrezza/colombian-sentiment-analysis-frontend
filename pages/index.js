import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Link from '../src/Link';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'content',
    headerName: 'Content',
    width: 450,
    editable: false,
    sortable: false,
  },
  {
    field: 'aprox_city',
    headerName: 'Aprox. City',
    width: 150,
    editable: true,
    sortable: false,
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 150,
    editable: true,
    sortable: false,
  },
];

export default function Index() {

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/data_clean/?skip=${skip}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.map(r => ({id: r.id, content: r.content, date: r.date, aprox_city: r.aprox_city})))
        console.log(data)
        setLoading(false)
      })
  }, [])
  
  return (
    <div style={{ height: 'calc(90vh - 64px)', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={30}
        rowsPerPageOptions={[30]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
