
import React from 'react';
import { alpha, AppBar, Box, Card, styled, Typography, InputBase, Toolbar, Avatar } from '@mui/material';
import useWebPlaygroundStore from '../../../store';
import styles from './index.module.scss';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const FrameworkLayout = (props: any) => {
  const siderData = useWebPlaygroundStore(state => state.siderData);

  return (
    <Box className={styles.layout}>
      <AppBar className="header" position='sticky'>
        <Toolbar>
          <Link href='/'>
            <Avatar src="/icon.JPG" alt="ICON" />
          </Link>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <Link href='/framework'>
              Web-Playground
            </Link>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      {/* <Card css={{ width: 275, height: 'calc(100% - 76px)', borderRadius: 0, display: 'inline-block', verticalAlign: 'top' }}> */}
      <Card sx={{ width: 275, height: 'calc(100% - 76px)', borderRadius: 0, display: 'inline-block', verticalAlign: 'top' }}>
        {siderData.map((item, i) =>
          // <Typography key={item.title + i} color='' css={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: 'auto 4px', '&:hover': { color: '$secondary' } }}>
          <Typography key={item.title + i}>
            <Link href={item.linkTo}>
              {`${i + 1}. ${item.title}`}
            </Link>
          </Typography>
        )}
      </Card>
      {/* <Card css={{ width: 'calc(100% - 275px)', height: 'calc(100% - 76px)', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top' }}> */}
      <Card sx={{ width: 'calc(100% - 275px)', height: 'calc(100% - 76px)', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top' }}>
        <SimpleBar autoHide={false}>
          {props.children}
        </SimpleBar>
      </Card>
    </Box >
  )
}

export default FrameworkLayout;