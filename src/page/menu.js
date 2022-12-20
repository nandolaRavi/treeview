import { useCallback, useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { pasteDir, copyDir, checkConfing, setCopySourcePath } from '../redux/reducers/treeViewSlice'
import Swal from 'sweetalert2';
import { useSelect } from '@mui/base';
import AlertBox from './Alert';
import Modal from './Alert';
const ContextMenu = ({ currObj, path }) => {
    const isConflict = useSelector((state) => state.treeView.isConflict);
    const sourcePath = useSelector((state) => state.treeView.sourcePath);
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    const open = Boolean(anchorEl);

    const dispatch = useDispatch()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCopy = useCallback((path) => {
        dispatch(setCopySourcePath(path))
    }, [dispatch, setAnchorEl]);

    const handleCut = () => {
        setAnchorEl(null);

    };
    const handlePaste = useCallback((path) => {
        dispatch(pasteDir({ path: path }))
    }, [dispatch, setAnchorEl])



    return (
        <>
            <div>
                {/* {isConflict == true &&
                    <AlertBox
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                } */}
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
                    <MenuItem onClick={() => { handleCopy(path) }}>copy</MenuItem>
                    <MenuItem onClick={handleCut}>cut</MenuItem>
                    {sourcePath !== '' && sourcePath!==path && <MenuItem onClick={() => { handlePaste(path) }}>paste</MenuItem>}

                </Menu>
            </div>

        </>
    );
}
export default ContextMenu