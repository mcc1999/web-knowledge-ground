
import React from 'react';
import styles from './index.module.scss'
import { Card, Layout } from 'antd';

const { Header, Content, Sider } = Layout;

const FrameworkLayout = (props: any) => {

  return <>
    <Layout className={styles.layout}>
      <Header className="header">
        <div className="logo" />
        <span className='title'>Web-Playground</span>
      </Header>
      <Layout>
        <Sider width={200} className={`site-layout-background navbar`}> </Sider>
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