export const validate = (values) => {
    const errors = {};

    let formObject = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
    };

    Object.keys(formObject).forEach((key) => {
        if (Number(formObject[key])) return errors[key] = 'Not allow  numeric value';
        if (formObject[key]) return;
        errors[key] = 'This field is required';
    });

    if (formObject.firstName.length > 5) {
        errors.firstName = 'Must be 20 characters or less';
    };

    // if (!values.firstName) {
    //     errors.firstName = 'Required';
    // } else if (values.firstName.length > 15) {
    //     errors.firstName = 'Must be 15 characters or less';
    // }

    // if (!values.lastName) {
    //     errors.lastName = 'Required';
    // } else if (values.lastName.length > 20) {
    //     errors.lastName = 'Must be 20 characters or less';
    // }

    // if (!values.email) {
    //     errors.email = 'Required';
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors.email = 'Invalid email address';
    // }

    return errors;
};