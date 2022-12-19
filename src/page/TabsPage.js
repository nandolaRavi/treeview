import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filterDir } from '../redux/reducers/treeViewSlice';
import TrashData from "./trashTree"
import Tree from './Tree';
const TabsPage = ({ treeData }) => {
  const [key, setKey] = useState('home');
  const serachKeyitem = useSelector((state) => state.treeView.searchKeyWord);
  const curPath = useSelector((state) => state.treeView.curPath);
  const searchKeyWord = useSelector((state) => state.treeView.searchKeyWord);
  const data = filterDir(treeData);
  const serachKeyWord = useSelector((state) => state.treeView.serachKeyWord);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3">
      <Tab eventKey="home" title="Home">
        <Tree data={treeData} currPath={curPath} serachKeyWord={serachKeyWord} />
      </Tab>
      <Tab eventKey="trash" title="Trash">
        <TrashData treeData={data} path={curPath} />
      </Tab>
    </Tabs >
  );
}
export default TabsPage;
