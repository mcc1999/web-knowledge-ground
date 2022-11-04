
import React from 'react';
import { AppBar, Box, Card, Typography, Autocomplete, Toolbar, Avatar, TextField, Paper, Popper } from '@mui/material';
import useWebPlaygroundStore from '../../../store';
import styles from './index.module.scss';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router'

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

const FrameworkLayout = (props: any) => {
  const router = useRouter();
  const theme = useTheme();
  const [siderData, updateSelectPostId] = useWebPlaygroundStore(state => [state.siderData, state.updateSelectPostId]);

  const handelAutocompleteChange = (event: any, value: any) => {
    router.push(value.value)
  }
  return (
    <Box className={styles['framework-layout']}>
      <AppBar className="appBar-header" position='sticky'>
        <Toolbar>
          <Link href='/' >
            <Avatar src="/icon.JPG" alt="ICON" sx={{ marginRight: '16px', cursor: 'pointer' }} />
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
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ width: 275, height: 'calc(100% - 64px)', padding: '16px 0', borderRadius: 0, display: 'inline-block', verticalAlign: 'top', }}>
        {siderData.map((item, i) =>
          <Typography
            key={item.title + i}
            noWrap
            onClick={() => updateSelectPostId(item.id)}
            sx={{
              '&:hover': { color: 'purple.main', backgroundColor: alpha(theme.palette.purple.light, 0.15) },
              color: router.asPath === item.linkTo ? 'purple.main' : 'inherit',
              backgroundColor: router.asPath === item.linkTo ? alpha(theme.palette.purple.light, 0.15) : '',
              marginBottom: '4px',
              padding: '4px  0 4px 16px',
            }}
          >
            <Link href={item.linkTo}>
              {`${i + 1}. ${item.title}`}
            </Link>
          </Typography>
        )}
      </Paper>
      <Card sx={{ width: 'calc(100% - 275px)', height: 'calc(100% - 64px)', padding: '32px', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top' }}>
        <SimpleBar autoHide={false}>
          <div className='markdown-body'>{props.children}</div>
        </SimpleBar>
      </Card>
    </Box >
  )
}

export default FrameworkLayout;