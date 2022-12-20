import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { editDir } from "../redux/reducers/treeViewSlice"
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector, useDispatch } from 'react-redux';
import { FaEye } from "react-icons/fa";

export const EditView = ({ path }) => {
    const [isDirName, setIsDirName] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [dirName, setDirName] = useState("");
    const [fileConatin, setFileConatin] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const selectedDirData = useSelector((state) => state.treeView.viewCurrDir);
    const curPath = useSelector((state) => state.treeView.curPath);

    const dishpatch = useDispatch()

    const handleDirName = (event) => {
        setIsEdit(true)
        setDirName(event.target.value);
    };

    const createItem = () => {
        let dirname = dirName.charAt(0).toUpperCase() + dirName.slice(1);
        let newObj = {
            name: dirname == '' ? selectedDirData.label : dirname,
            currPath: curPath,
            description: fileConatin === '' ? selectedDirData.description : fileConatin
        };
        dishpatch((editDir(newObj)))
        //localStorage.setItem('newItem', JSON.stringify(newObj));
        //localStorage.setItem('lastupdatedate', new Date())
    };
    const handleDescription = (e) => {
        setIsEdit(true);
        setFileConatin(e.target.value);
    }

    return (
        <>
            <FaEye onClick={handleShow} className='text-white fs-4' />
            <Offcanvas show={show} onHide={handleClose} backdrop="static" placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Edit Info</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div class="card">
                        <div class="card-header">
                            <b>Created_at</b>: {selectedDirData.create_At}
                        </div>
                        <div class="card-body">
                            <div className=' d-flex align-items-center justify-content-end'><b >Updated_at</b>: {selectedDirData.updated_At}</div>
                            <div className="m-1 w-100">
                                <h6 className='mx-1'>Dir name</h6>
                                <input className="form-control p-3" defaultValue={selectedDirData.label} type="text" placeholder={`Enter dir name`} onChange={(e) => handleDirName(e)} />
                                {isDirName && <p className="mx-2 my-0 text-danger">please enter dir name</p>}
                            </div>
                            {
                                selectedDirData.type == '1' &&
                                <div className="m-1 w-100">
                                    <h6 className='mx-1'>Description</h6>
                                    <textarea className="form-control" defaultValue={selectedDirData.description} type="text" placeholder={`Enter file description`} onChange={(e) => handleDescription(e)} />
                                </div>
                            }
                        </div>
                        {
                            isEdit &&
                            <div className='card-footer d-flex align-items-center justify-content-end'>
                                <Button variant="primary" onClick={() => createItem()}>Save</Button>
                            </div>
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};
export default EditView
