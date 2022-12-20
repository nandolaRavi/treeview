import { useSelector } from 'react-redux';
import { AddModal } from './AddModal';
import { useCallback, useEffect, useState } from 'react';
import { createDir, searchDir, findDirArray, mergeDir, replaseDir } from '../redux/reducers/treeViewSlice';
import { useDispatch } from 'react-redux';
import TabsPage from './TabsPage.js';
import AlertModal from './Alert';
const Home = () => {
    const dispatch = useDispatch();
    var isConflict = useSelector((state) => state.treeView.isConflict);
    const curPath = useSelector((state) => state.treeView.curPath);
    const items = useSelector(state => state.treeView.files) || [];
    const currType = useSelector(state => state.treeView.currType);
    const [lastUpdatedDate, setLastUpdatedDate] = useState('');
    const [treeData, setTreeData] = useState(items);

    // setInterval(() => {
    //     setLastUpdatedDate(localStorage.getItem('lastupdatedate'))
    // }, 100);
    useEffect(() => {
        if (lastUpdatedDate) {
            let newItemData = JSON.parse(localStorage.getItem('newItem'));
            dispatch(createDir(newItemData));
        }
    }, [lastUpdatedDate]);

    useEffect(() => {
        localStorage.clear();
    }, [])

    useEffect(() => {
        setTreeData(items)
    }, [items])


    const filterBy = useCallback((arr, query) => {
        return query ? arr.reduce((acc, item) => {
            if (item.children.length > 0) {
                const filtered = filterBy(item.children, query)
                if (filtered.length) return [...acc, { ...item, children: filtered }]
            }
            const { children, ...itemWithoutChildren } = item;
            return item.label?.toLowerCase().includes(query.toLowerCase()) ? [...acc, itemWithoutChildren] : acc
        }, []) : arr
    }, [items]);

    const searchFileItem = useCallback((text) => {
        setTreeData(filterBy(items, text));
        dispatch(searchDir({ text: text }))
    }, [setTreeData, dispatch,])

    const onMerge = useCallback(() => {
        dispatch(mergeDir());
        isConflict = false
    }, [dispatch, isConflict])

    const onRepalse = useCallback(() => {
        dispatch(replaseDir())
        isConflict = false
    }, [dispatch, isConflict])

    return (
        <>
            {
                isConflict && <div>
                    File or folder already exist on destination path,
                    <button className='btn btn-primary' onClick={() => onMerge()}>Merge</button>
                    <button className='btn btn-secondary' onClick={() => onRepalse()}>replace</button>
                </div>
            }
            <div>
                <div className='m-2 p-3 bg-info d-flex w-100 justify-content-between'>
                    <div className='w-25'>
                        <input className='form-control' onKeyUp={(e) => searchFileItem(e.target.value)} placeholder="Search..." type='text' />
                    </div>
                    <div className='align-items-center'>
                        {currType !== '' && currType !== '1' && <AddModal treeData={items} />}
                    </div>
                </div>
                <div className='d-flex vh-100'>
                    <div className='w-50 border border-1'>
                        <h6 className='m-2 m-1 border border-1 text-secondary'>{curPath}</h6>

                        <TabsPage treeData={treeData} />
                        {
                            treeData.length === 0 && <h4 className='text-dark'>
                                Data not found
                            </h4>
                        }
                    </div>
                </div>


            </div >
        </>

    );
};

export default Home