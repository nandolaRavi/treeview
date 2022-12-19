import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';

export const AddModal = ({ treeData }) => {
    const [selecteDir, setSelecteDir] = useState("");
    const [isSelecteDir, setIsSelecteDir] = useState(false);
    const [isDirName, setIsDirName] = useState(false);
    const [dirName, setDirName] = useState("");
    const [fileConatin, setFileConatin] = useState('');
    const [show, setShow] = useState(false);
    var dirArry = [];
    var fileArry = [];
    const curPath = useSelector((state) => state.treeView.curPath);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // useEffect(() => {
    //     getAllLable(treeData)
    // }, [treeData, dirName, selecteDir, dirArry, fileArry]);

    // const getAllLable = (data) => {
    //     data.map((item) => {
    //         if (!!item && item.type === '0') {
    //             dirArry.push(item.label)
    //         }
    //         if (!!item && item.type === '1') {
    //             fileArry.push(item.label)
    //         }
    //         if (item.children.length > 0) {
    //             getAllLable(item.children)
    //         }
    //     })
    // };

    const handleChange = (event) => {
        setSelecteDir(event.target.value);
        if (event.target.value === '') {
            setIsSelecteDir(true);
        } else {
            setIsSelecteDir(false)
        };
    };

    const handleDirName = (event) => {
        setDirName(event.target.value);
        if (dirName === "") {
            setIsDirName(true);
        } else {
            setIsDirName(false);
        };
    };

    const createItem = () => {
        if (dirName === "" || selecteDir === "") {
            setIsDirName(true);
            setIsSelecteDir(true);
        } else {
            let dirType = selecteDir === "file" ? '1' : '0';
            let dirname = dirName.charAt(0).toUpperCase() + dirName.slice(1);
            let selectedType = dirType === '0' ? dirArry : fileArry;
            if (selectedType.includes(dirname)) {
                alert("already exist dir");
                setShow(false)
            } else {
                let newObj = {
                    name: dirname,
                    type: dirType,
                    currPath: curPath,
                    description: fileConatin,
                    created_At: new Date().toDateString(),
                    isDelete: false
                };
                localStorage.setItem('newItem', JSON.stringify(newObj));
                localStorage.setItem('lastupdatedate', new Date())
                setShow(false);
            }

        };
    };

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
