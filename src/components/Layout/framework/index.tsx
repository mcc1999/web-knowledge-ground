
import React from 'react';
import styles from './index.module.scss'
import { Card, Layout, Menu, Switch, Tooltip } from 'antd';
import Link from 'next/link';
import useWebPlaygroundStore from '../../../store';

const { Header, Content, Sider } = Layout;

const FrameworkLayout = (props: any) => {
  const siderData = useWebPlaygroundStore(state => state.siderData);
  const toggleTheme = (checked: boolean) => {

  }

  return <>
    <Layout className={styles.layout}>
      <Header className="header">
        <img src="/icon.JPG" alt="ICON" />
        <Link href='/framework'><span className='title'>Web-Playground</span></Link>
        {/* <Switch unCheckedChildren='Light' checkedChildren='Dark' onChange={toggleTheme} /> */}
      </Header>
      <Layout>
        <Sider width={200} className={`site-layout-background navbar`}>
          <Menu
            selectable={false}
            items={siderData.map((item, i) => ({
              label: <Link href={item.linkTo}>
                <Tooltip title={`${item.title}`} placement='topLeft' overlayInnerStyle={{ fontSize: 8 }}>
                  {`${i + 1}. ${item.title}`}
                </Tooltip></Link>,
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