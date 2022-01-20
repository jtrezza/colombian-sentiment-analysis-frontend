import Typography from '@mui/material/Typography';
import Link from '../src/Link';

export default function Index() {
  
  return (
    <>
        <Typography paragraph>
          Hello
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about pages
        </Link>
    </>
  );
}
