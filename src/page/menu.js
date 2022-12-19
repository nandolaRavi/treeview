import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaEllipsisV } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { pasteDir, copyDir } from '../redux/reducers/treeViewSlice'
import Swal from 'sweetalert2';
const ContextMenu = ({ currObj, path }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const dishpatch = useDispatch()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCopy = () => {
        dishpatch(copyDir({ path: path, currObj: currObj }));
        setAnchorEl(null);
    };
    const handleCut = () => {
        setAnchorEl(null);

    };
    const handlePaste = () => {
        Swal.fire({
            title: 'Do you want to paste dir?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Merge',
            denyButtonText: `override`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                dishpatch(pasteDir({ currObj: currObj, option: "Merge" }));
            } else if (result.isDenied) {
                dishpatch(pasteDir({ currObj: currObj, option: "override" }));
            }
        })
        setAnchorEl(null);
    };

    return (
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
                <MenuItem onClick={handleCopy}>copy</MenuItem>
                <MenuItem onClick={handleCut}>cut</MenuItem>
                {currObj.type === '0' && <MenuItem onClick={handlePaste}>paste</MenuItem>}

            </Menu>
        </div>
    );
}
export default ContextMenu