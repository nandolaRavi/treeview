import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useState } from 'react';
import { filterDeleletdItem } from '../redux/reducers/TreeViewSlice';
import Tree from './Tree';
import Recybin from './Recybin';

const TabsPage = ({ treeData }) => {
  const [key, setKey] = useState('home');
  const trashData = filterDeleletdItem(treeData);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3">
      <Tab eventKey="home" title="Home">
        <Tree treeData={treeData} />
      </Tab>
      <Tab eventKey="trash" title="Trash">
        <Recybin trashData={trashData} />
      </Tab>
    </Tabs >
  );
}
export default TabsPage;
