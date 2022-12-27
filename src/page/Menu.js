import { useCallback, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { pasteDir, setCopySourcePath, setCutSourePath } from '../redux/reducers/TreeViewSlice';


const ContextMenu = ({ type, path }) => {
    const { sourcePath, cutSourePath } = useSelector((state) => state.treeView);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handleCopy = useCallback((path) => {
        dispatch(setCopySourcePath(path))
        setAnchorEl(null);
    }, [dispatch, setAnchorEl]);

    const handleCut = useCallback(() => {
        dispatch(setCutSourePath(path))
        setAnchorEl(null);
    }, [setAnchorEl, dispatch]);

    const handlePaste = useCallback((path) => {
        dispatch(pasteDir({ path: path }));
        setAnchorEl(null);

    }, [dispatch, setAnchorEl])

    return (
        <>
            <div>
                <FaEllipsisV
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="fs-4"
                />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => handleCopy(path)}>copy</MenuItem>
                    <MenuItem onClick={handleCut}>cut</MenuItem>
                    {(sourcePath !== '' && sourcePath !== path || cutSourePath !== path && cutSourePath !== '') && type === '0' && < MenuItem onClick={() => handlePaste(path)}>paste</MenuItem>}
                </Menu>
            </div>

        </>
    );
}
export default ContextMenu