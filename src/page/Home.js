import { useSelector } from 'react-redux';
import { AddModal } from './AddModal';
import { useCallback, useEffect, useState } from 'react';
import { setSearchText, mergeDir, replaseDir } from '../redux/reducers/TreeViewSlice';
import { useDispatch } from 'react-redux';
import TabsPage from './TabsPage.js';
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const { files, isConflict, curPath } = useSelector((state) => state.treeView)
    const [treeData, setTreeData] = useState(files);

    useEffect(() => {
        setTreeData(files);
    }, [files])

    const searchIitem = useCallback((arr, query) => {
        return query ? arr.reduce((acc, item) => {
            console.log("acc", acc)
            if (item.children.length <= 0) return;
            const filtered = searchIitem(item.children, query);
            if (filtered.length) return [...acc, { ...item, children: filtered }];
            const { children, ...itemWithoutChildren } = item;
            return item.label?.toLowerCase().includes(query.toLowerCase()) ? [...acc, itemWithoutChildren] : acc
        }, []) : arr;
    }, [files]);

    const handleSearch = useCallback((text) => {
        setTreeData(searchIitem(files, text));
        dispatch(setSearchText({ text: text }))
    }, [setTreeData, dispatch,])

    const handleMerge = useCallback(() => {
        dispatch(mergeDir());
    }, [dispatch]);

    const handleRepalse = useCallback(() => {
        dispatch(replaseDir());
    }, [dispatch]);

    return (
        <>
            {isConflict &&
                <div>
                    File or folder already exist on destination path,
                    <button className='btn btn-primary' onClick={() => handleMerge()}>Merge</button>
                    <button className='btn btn-secondary' onClick={() => handleRepalse()}>Replace</button>
                </div>
            }
            <div>
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