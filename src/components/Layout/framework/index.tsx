
import React from 'react';
import { Navbar, Image, Container, Text, Card } from '@nextui-org/react';
import useWebPlaygroundStore from '../../../store';
import styles from './index.module.scss';
import Link from 'next/link';

const FrameworkLayout = (props: any) => {
  const siderData = useWebPlaygroundStore(state => state.siderData);

  return (
    <Container className={styles.layout} responsive={false} css={{ padding: 0 }}>
      <Navbar className="header">
        <Navbar.Brand>
          <Image src="/icon.JPG" alt="ICON" objectFit='fill' />
          <Link href='/framework'>
            <span className='title'>Web-Playground</span>
          </Link>
        </Navbar.Brand>
        {/* <Switch unCheckedChildren='Light' checkedChildren='Dark' onChange={toggleTheme} /> */}
      </Navbar>
      <Card css={{ width: 200, height: 'calc(100% - 76px)', borderRadius: 0, display: 'inline-block', verticalAlign: 'top' }}>
        <Card.Body>
          {siderData.map((item, i) =>
            <Text key={item.title + i} css={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: 'auto 4px', }}>
              <Link href={item.linkTo}>
                {`${i + 1}. ${item.title}`}
                {/* <Tooltip content={`${item.title}`} placement='topStart'>
              </Tooltip> */}
              </Link>
            </Text>
          )}
        </Card.Body>
      </Card>
      <Card css={{ width: 'calc(100% - 200px)', height: 'calc(100% - 76px)', display: 'inline-block', overflowY: 'scroll', borderRadius: 0, verticalAlign: 'top' }}>
        <Card.Body>
          {props.children}
        </Card.Body>
      </Card>
    </Container >
  )
}

export default FrameworkLayout;