import { Formik, useFormik } from 'formik';
import React from 'react'
import { validate } from "../../common/LoginFormValidation"
const Login = () => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: ''
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const handleReset = () => {
        formik.resetForm();
    };

    return (
        <div className='vh-100'>
            <div className='card w-50 m-auto d-flex  align-items-center'>
                <h2>Login Form</h2>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        className='form-control'
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                    />
                    <div className='text-danger'>
                        {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
                    </div>

                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        className='form-control'
                        name="lastName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                    />
                    <div className='text-danger'>
                        {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
                    </div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        className='form-control'
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    <div className='text-danger'>
                        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                    </div>
                    <button type="submit" className='btn btn-dark mx-3 my-1'>Submit</button>
                    <button type="button" onClick={() => handleReset()} className='btn btn-danger'>reset</button>
                </form>
            </div>
        </div >
    )
}
export default Login;