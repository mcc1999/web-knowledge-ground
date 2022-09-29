
import React from 'react';
import styles from './index.module.scss'
import { Card, Layout, Menu } from 'antd';
import Link from 'next/link';
import useWebPlaygroundStore from '../../../store';

const { Header, Content, Sider } = Layout;

const FrameworkLayout = (props: any) => {
  const siderData = useWebPlaygroundStore(state => state.siderData);

  return <>
    <Layout className={styles.layout}>
      <Header className="header">
        <div className="logo" />
        <Link href='/framework'><span className='title'>Web-Playground</span></Link>
      </Header>
      <Layout>
        <Sider width={200} className={`site-layout-background navbar`}>
          <Menu
            selectable={false}
            items={siderData.map(item => ({
              label: <Link href={item.linkTo} >{item.title}</Link>,
              key: item.id
            }))}
          />
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              minHeight: 280,
            }}
          >
            <Card style={{ height: '100%', overflowY: 'scroll' }}>
              {props.children}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </>
}

export default FrameworkLayout;