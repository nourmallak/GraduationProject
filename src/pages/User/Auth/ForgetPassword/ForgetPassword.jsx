import * as yup from 'yup';
import { useFormik } from 'formik';
import style from '../ForgetPassword/forgetPassword.module.css';
import logo from '../../../../images/logo/logo.png'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export function ForgetPassword() {

    const navigate= useNavigate();
    const schema = yup.object(
        {
            email: yup.string().required("Email is required").email("Invalid email format"),
        }
    )

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: forgetPassword,
        validationSchema: schema
    });

    async function forgetPassword() {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API}/Auths/Forgot-password`, formik.values);
            if (data) {
                navigate('/signin');
                toast.success("Check Your Email Please!");
                
            }
        } catch (error) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            setErrorMessage(message);
            toast.error(message);
        }

    }

    return (
        <>
            <div className={`${style.body}`}>
                <form className={`${style.form}`} onSubmit={formik.handleSubmit}>
                    <div className={`${style.imgPassword}`}>
                        <img src={`${logo}`} />
                    </div>
                    <div className='text-center'>
                        <h4>Forget Your Password?</h4>
                    </div>
                    <div className={`${style.feilds}`}>
                        <div className={`${style.inputcontainer} mb-3`}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="email">Email</label>

                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <button type="submit" className={`${style.PasswordBtn}`}>Send Email</button>
                      
                    </div>
                </form>



            </div>

        </>
    );
}