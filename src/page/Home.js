import { useSelector } from 'react-redux';
import { AddModal } from './AddModal';
import { useCallback, useEffect, useState } from 'react';
import { setSearchText } from '../redux/reducers/TreeViewSlice';
import { useDispatch } from 'react-redux';
import TabsPage from './TabsPage.js';
import React from 'react';
import { Link } from 'react-router-dom';
import Alert from './Alert';

const Home = () => {
    const dispatch = useDispatch();
    const { files, isConflict, curPath } = useSelector((state) => state.treeView)
    const [treeData, setTreeData] = useState(files);
    const [modalShow, setModalShow] = React.useState(true);

    useEffect(() => {
        setTreeData(files);
    }, [files]);

    const handleSearch = useCallback((text) => {
        dispatch(setSearchText({ text: text }))
    }, [dispatch,])

    return (
        <>
            {isConflict &&
                <Alert
                    show={modalShow}
                />
            }            <div>
                <div className='m-2 p-3 bg-info d-flex w-100 justify-content-between'>
                    <div className='w-25'>
                        <input className='form-control' onKeyUp={(e) => handleSearch(e.target.value)} placeholder="Search..." type='text' />
                    </div>
                    <div className='align-items-center'>
                        {<Link to={'terminal'}><button className='btn btn-dark mx-2'>open Terminal</button></Link>}
                        {<AddModal treeData={treeData} />}
                    </div>
                </div>
                <div className='d-flex vh-100'>
                    <div className='w-50 border border-1'>
                        <h6 className='m-2 m-1 border border-1 text-secondary'>{curPath}</h6>
                        {treeData.length === 0 ? <h4 className='text-dark'>Data not found</h4> : <TabsPage treeData={treeData} />}
                    </div>
                </div>
            </div>
        </>

    );
};

export default Home