
import React from 'react';
import { Navbar, Image, Container, Text, Card, Input } from '@nextui-org/react';
import useWebPlaygroundStore from '../../../store';
import styles from './index.module.scss';
import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { SearchIcon } from '../../../assets/svg/searchIcon'

const FrameworkLayout = (props: any) => {
  const siderData = useWebPlaygroundStore(state => state.siderData);

  return (
    <Container className={styles.layout} responsive={false} css={{ padding: 0 }}>
      <Navbar className="header" variant='sticky'>
        <Navbar.Brand>
          <Link href='/'>
            <Image src="/icon.JPG" alt="ICON" objectFit='fill' />
          </Link>
          <Link href='/framework'>
            <span className='title'>Web-Playground</span>
          </Link>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item
            css={{
              "@xsMax": {
                w: "100%",
                jc: "center",
              },
            }}
          >
            <Input
              clearable
              animated={false}
              color='secondary'
              bordered
              contentLeft={
                <SearchIcon fill="var(--nextui-colors-accents6)" size={16} />
              }
              contentLeftStyling={false}
              css={{
                w: "100%",
                "@xsMax": {
                  mw: "300px",
                },
                "& .nextui-input-content--left": {
                  h: "100%",
                  ml: "$4",
                  dflex: "center",
                },
              }}
              placeholder="Search..."
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Card css={{ width: 275, height: 'calc(100% - 76px)', borderRadius: 0, display: 'inline-block', verticalAlign: 'top' }}>
        <Card.Body>
          {siderData.map((item, i) =>
            <Text key={item.title + i} color='' css={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: 'auto 4px', '&:hover': { color: '$secondary' } }}>
              <Link href={item.linkTo}>
                {`${i + 1}. ${item.title}`}
                {/* <Tooltip content={`${item.title}`} placement='topStart'>
              </Tooltip> */}
              </Link>
            </Text>
          )}
        </Card.Body>
      </Card>
      <Card css={{ width: 'calc(100% - 275px)', height: 'calc(100% - 76px)', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top' }}>
        <SimpleBar autoHide={false}>
          <Card.Body>
            {props.children}
          </Card.Body>
        </SimpleBar>
      </Card>
    </Container >
  )
}

export default FrameworkLayout;