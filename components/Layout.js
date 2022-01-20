import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import AbcIcon from '@mui/icons-material/Abc';
import StorageIcon from '@mui/icons-material/Storage';
import CssBaseline from '@mui/material/CssBaseline';

import { useRouter } from 'next/router';

const drawerWidth = 210;

export default function Layout(props) {
  const router = useRouter();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (href) => {
    router.push(href)
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem>
            <ListItemText
              primaryTypographyProps={{
                fontSize: 22,
                fontWeight: 700
              }}
              primary="Inicio" />
          </ListItem>
          <ListItem button selected={router.pathname === '/explore-data'} onClick={()=>handleClick('explore-data')}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Datos" />
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem>
            <ListItemText
              primaryTypographyProps={{
                fontSize: 22,
                fontWeight: 700
              }}
              primary="Técnicas" />
          </ListItem>
          <ListItem button selected={router.pathname === '/lexicon'} onClick={()=>handleClick('lexicon')}>
            <ListItemIcon>
              <AbcIcon />
            </ListItemIcon>
            <ListItemText primary="Lexicon" />
          </ListItem>
          <ListItem button selected={router.pathname === '/classifier'} onClick={()=>handleClick('classifier')}>
            <ListItemIcon>
              <BubbleChartIcon />
            </ListItemIcon>
            <ListItemText primary="Classifier" />
          </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Análisis de Sentimientos
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  )
}