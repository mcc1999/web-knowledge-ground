
import React, { useState } from 'react';
import { AppBar, Box, Card, Typography, Autocomplete, Toolbar, Avatar, TextField, Paper, Popper } from '@mui/material';
import useWebPlaygroundStore from '@/store';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router'
import ThemeSwitch from '@/components/ThemeSwitch';
import { AiOutlineCaretLeft, AiOutlineCaretRight } from 'react-icons/ai'
import styles from './index.module.scss';

const SearchAutocomplete = styled(Autocomplete)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 100,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch !important',
    },
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.purple.main,
      borderWidth: '2px',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.purple.main,
    },
  },
}));

const MDXLayout = (props: any) => {
  const router = useRouter();
  const theme = useTheme();
  const [siderData, updateSelectPostId, siderFolded, toggleSiderFolded] = useWebPlaygroundStore(state => [state.siderData, state.updateSelectPostId, state.siderFolded, state.toggleSiderFolded]);

  const handelAutocompleteChange = (event: any, value: any) => {
    router.push(value.value)
  }
  return (
    <Box className={styles['mdx-layout']}>
      <AppBar position='sticky'>
        <Toolbar>
          <Link href='/'>
            <Avatar src="/images/icon.JPG" className={styles['avatar-img']} alt="ICON" sx={{ marginRight: '16px', cursor: 'pointer' }} />
          </Link>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <Link href='/mdx'>
              <span className={styles['header-title']}>Web-Playground</span> 
            </Link>
            <svg width="0" height="0">
              <filter id="filter">
                <feTurbulence id="turbulence" type="fractalNoise" baseFrequency=".03" numOctaves="20" />
                <feDisplacementMap in="SourceGraphic" scale="10" />
              </filter>
            </svg>
          </Typography>
          <SearchAutocomplete
            options={siderData.map(item => ({ label: item.title, value: item.linkTo }))}
            disableClearable
            forcePopupIcon={false}
            isOptionEqualToValue={(option: any, value: any) => {
              return option.value === value.value
            }}
            ListboxProps={{
              // @ts-ignore
              sx: {
                '.MuiAutocomplete-option': {
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              },
            }}
            PopperComponent={(params) => <Popper {...params} placement='bottom-start' />}
            PaperComponent={(params) => <Paper {...params} sx={{ width: '300px', maxHeight: '300px', }} />}
            onChange={handelAutocompleteChange}
            renderInput={(params) =>
              <StyledTextField
                {...params}
                size='small'
                id="input-with-icon-textfield"
                placeholder="Search..."
              />
            }
          />
          <ThemeSwitch />
        </Toolbar>
      </AppBar>
      <Paper className={styles['content']} elevation={3} sx={{ width: siderFolded ? 0 : 275, height: 'calc(100% - 64px)', padding: '16px 0', borderRadius: 0, display: 'inline-block', verticalAlign: 'top', transition: 'width .5s' }}>
        <div className={styles['fold-icon']} style={{left: siderFolded ? 0 : 275}} onClick={() => toggleSiderFolded()}>{siderFolded ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}</div>
        {siderData.map((item, i) =>
          <Typography
            key={item.title + i}
            noWrap
            onClick={() => updateSelectPostId(item.id)}
            sx={{
              '&:hover': { color: 'purple.main', backgroundColor: alpha(theme.palette.purple.light, 0.15) },
              color: decodeURIComponent(router.asPath) === item.linkTo ? 'purple.main' : 'inherit',
              backgroundColor: decodeURIComponent(router.asPath) === item.linkTo ? alpha(theme.palette.purple.light, 0.15) : '',
              marginBottom: '4px',
              padding: '4px  0 4px 16px',
            }}
          >
            <Link href={item.linkTo}>
              <span title={item.title} className={styles['content-item']}>  
                {`${i + 1}. ${item.title}`}
              </span>
            </Link>
          </Typography>
        )}
      </Paper>
      <Card sx={{ width: `calc(100% - ${siderFolded ? 0 : 275}px)`, height: 'calc(100% - 64px)', padding: '32px 10%', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top', transition: 'width .5s' }}>
        <div className='markdown-body'>{props.children}</div>
      </Card>
    </Box >
  )
}

export default MDXLayout;