import { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { mergeDir, replaseDir, setIsConflict } from '../redux/reducers/TreeViewSlice';
import { GoX } from "react-icons/go";

function Alert(props) {
    const dispatch = useDispatch();
    const handleMerge = useCallback(() => {
        dispatch(mergeDir());
    }, [dispatch]);

    const handleRepalse = useCallback(() => {
        dispatch(replaseDir());
    }, [dispatch]);

    const hanldeClose = useCallback(() => {
        dispatch(setIsConflict())
    });
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header className='w-100'>
                <Modal.Title id="contained-modal-title-vcenter">
                    Merge && Repalse
                </Modal.Title>
                <GoX className='fs-2 text-danger' onClick={hanldeClose} />
            </Modal.Header>
            <Modal.Body>
                <p>
                    File or folder already exist on destination path,
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='info' onClick={() => handleMerge()}><b>Merge</b></Button>
                <Button variant='secondary' onClick={() => handleRepalse()}><b>Repalse</b></Button>

            </Modal.Footer>
        </Modal>
    );
}
export default Alert