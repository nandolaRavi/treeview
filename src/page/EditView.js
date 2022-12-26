import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { editDir, findDirObj } from "../redux/reducers/TreeViewSlice"
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector, useDispatch } from 'react-redux';
import { FaEye } from "react-icons/fa";

export const EditView = () => {
    const { files, curPath } = useSelector((state) => state.treeView);
    const [name, setName] = useState('');
    const [descripation, setDescripation] = useState('')
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const dishpatch = useDispatch();
    const selectedDirData = findDirObj(curPath, files);
    console.log(selectedDirData);

    const handleName = useCallback((event) => {
        setName(event.target.value);
        setIsEdit(true)
    }, [setIsEdit, setName]);

    const handleDescription = useCallback((e) => {
        setIsEdit(true);
        setDescripation(e.target.value);
    }, [setIsEdit, setDescripation]);

    const editFileItem = useCallback((value) => {
        dishpatch((editDir({ name: value })));
    }, [dishpatch, name]);

    return (
        <>
            <FaEye onClick={() => setShow(true)} className='text-white fs-4' />
            <Offcanvas show={show} onHide={() => setShow(false)} backdrop="static" placement={'end'}>
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
                                <input className="form-control p-3" defaultValue={selectedDirData.label} type="text" placeholder={`Enter dir name`} onChange={(e) => handleName(e)} />
                            </div>
                            {
                                selectedDirData.type === '1' &&
                                <div className="m-1 w-100">
                                    <h6 className='mx-1'>Description</h6>
                                    <textarea className="form-control" defaultValue={selectedDirData.description} type="text" placeholder={`Enter file description`} onChange={(e) => handleDescription(e)} />
                                </div>
                            }
                        </div>
                        {
                            isEdit &&
                            <div className='card-footer d-flex align-items-center justify-content-end'>
                                <Button variant="primary" onClick={() => editFileItem(name)}>Save</Button>
                            </div>
                        }
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};
export default EditView
