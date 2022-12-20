import React, { useCallback, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { createDir } from "../redux/reducers/treeViewSlice";

export const AddModal = () => {
    const [selecteDir, setSelecteDir] = useState("");
    const [isSelecteDir, setIsSelecteDir] = useState(false);
    const [isDirName, setIsDirName] = useState(false);
    const [dirName, setDirName] = useState("");
    const [fileConatin, setFileConatin] = useState('');
    const [show, setShow] = useState(false);
    const dispatch = useDispatch()
    const curPath = useSelector((state) => state.treeView.curPath);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = useCallback((event) => {
        setSelecteDir(event.target.value);
        if (event.target.value === '') {
            setIsSelecteDir(true);
        } else {
            setIsSelecteDir(false)
        };
    }, [setSelecteDir, setIsSelecteDir]);


    const handleDirName = useCallback((event) => {
        setDirName(event.target.value);
        if (event.target.value === "") {
            setIsDirName(true);
        } else {
            setIsDirName(false);
        };
    }, [setDirName, setIsDirName]);

    //  Create a new Dir or filesu
    const createItem = useCallback(() => {
        if (dirName === "" || selecteDir === "") {
            setIsDirName(true);
            setIsSelecteDir(true);
        } else {
            let dirType = selecteDir === "file" ? '1' : '0';
            let dirname = dirName.charAt(0).toUpperCase() + dirName.slice(1);

            let newObj = {
                name: dirname,
                type: dirType,
                currPath: curPath,
                description: fileConatin,
                created_At: new Date().toDateString(),
                isDelete: false
            };
            dispatch(createDir(newObj));
            localStorage.setItem('lastupdatedate', new Date())
            setShow(false);
        }
    }, [setShow, dispatch, setIsDirName, setIsSelecteDir, selecteDir, dirName]);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="p-2">
                add
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl className="w-100 m-1" size="small">
                        <InputLabel id="demo-select-small">select File Dir</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={selecteDir}
                            label="select File Dir"
                            onChange={handleChange}
                        >
                            <MenuItem value='file'>File</MenuItem>
                            <MenuItem value='folder'>Folder</MenuItem>
                        </Select>
                        {isSelecteDir && <p className=" mx-2 my-0 text-danger">please selecte dir name</p>}

                    </FormControl>
                    <div className="m-1 w-100">
                        <input className="form-control " type="text" placeholder={`Enter dir name`} onChange={(e) => handleDirName(e)} />
                        {isDirName && <p className="mx-2 my-0 text-danger">please enter dir name</p>}
                    </div>
                    {

                        selecteDir == 'file' &&
                        < div className="m-1 w-100">
                            <textarea className="form-control " type="text" placeholder={`Enter file contains`} onChange={(e) => setFileConatin(e.target.value)} />
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} className='text-white bg-danger'>Close</Button>
                    <Button variant="primary" onClick={() => createItem()}>Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
