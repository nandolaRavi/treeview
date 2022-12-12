import { useSelector } from 'react-redux';
import Tree from './Tree';
import { AddModal } from './AddModal';
import { useEffect, useState } from 'react';
import { createDir } from '../redux/reducers/treeViewSlice';
import { useDispatch } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch()
    const curPath = useSelector((state) => state.treeView.curPath);
    const items = useSelector(state => state.treeView.files) || [];
    const currType = useSelector(state => state.treeView.currType);
    const [lastUpdatedDate, setLastUpdatedDate] = useState('');

    setInterval(() => {
        setLastUpdatedDate(localStorage.getItem('lastupdatedate'))
    }, 100);

    useEffect(() => {
        if (lastUpdatedDate) {
            let newItemData = JSON.parse(localStorage.getItem('newItem'));
            dispatch(createDir(newItemData));
        }
    }, [lastUpdatedDate]);

    useEffect(() => {
        localStorage.clear()
    }, [])

    return (
        <>
            <div className='m-2 p-3 bg-info d-flex w-100 justify-content-between'>
                <div className='w-25'>
                    <input className='form-control' placeholder="Search..." type='text' />
                </div>
                <div className='align-items-center'>
                    {currType !== '' && currType !== '1' && <AddModal />}
                </div>
            </div>
            <h6 className='m-2 m-1 border border-1 text-secondary'>{curPath}</h6>
            <Tree treeData={items} path={curPath} />
        </>
    );
};

export default Home