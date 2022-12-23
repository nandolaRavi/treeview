import React, { useCallback, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { createDir } from "../redux/reducers/TreeViewSlice";

export const AddModal = () => {
    const curPath = useSelector((state) => state.treeView.curPath);
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [description, setDescripation] = useState('');
    const [show, setShow] = useState(false);

    const dispatch = useDispatch()

    // HANDLE DIR TYPE
    const handleType = useCallback((event) => {
        setType(event.target.value);
    }, [setType]);

    // HANDLE DIR OF FILE NAME
    const handleName = useCallback((event) => {
        setName(event.target.value);
    }, [setName]);

    // CREATE NEW FILE ITEMS 
    const createItem = useCallback(() => {
        let newObj = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            type: type === "file" ? '1' : '0',
            currPath: curPath,
            description: description,
            created_At: new Date().toDateString(),
            isDelete: false
        };
        dispatch(createDir(newObj));
        setShow(false);
    }, [setShow, dispatch, name, type]);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)} className="p-2">
                add
            </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl className="w-100 m-1" size="small">
                        <InputLabel id="demo-select-small">select type</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={type}
                            label="select File Dir"
                            onChange={handleType}
                        >
                            <MenuItem value='file'>File</MenuItem>
                            <MenuItem value='folder'>Folder</MenuItem>
                        </Select>
                        {/* //  {type = '' && <p className=" mx-2 my-0 text-danger">please selecte dir name</p>} */}

                    </FormControl>
                    <div className="m-1 w-100">
                        <input className="form-control " type="text" placeholder={`Enter ${type} name`} onChange={(e) => handleName(e)} />
                        {/* {isDirName && <p className="mx-2 my-0 text-danger">please enter dir name</p>} */}
                    </div>
                    {

                        type == 'file' &&
                        < div className="m-1 w-100">
                            <textarea className="form-control " type="text" placeholder='Enter file contains' onChange={(e) => setDescripation(e.target.value)} />
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShow(false)} className='text-white bg-danger'>Close</Button>
                    <Button variant="primary" onClick={() => createItem()}>Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
