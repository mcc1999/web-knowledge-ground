
import React, { ReactNode, useEffect, useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { getContentBySlug } from '../../utils/framework/framework';
import { SiderDataType } from '../../store/framework';
import useWebPlaygroundStore from '../../store';


export interface LayoutProps {
  siderData: SiderDataType[];
  rawString: string;
}

const FrameworkLayout = (props: LayoutProps) => {
  const { siderData, rawString } = props
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)

  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: rawString }}></div>
}

export default FrameworkLayout;

FrameworkLayout.layoutType = 'framework';