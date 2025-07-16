import * as yup from 'yup';
import { useFormik } from 'formik';
import style from '../ResetPassword/resetPassword.module.css';
import logo from '../../../../images/logo/logo.png';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../../../Loader/Loader';
import { useEffect, useState } from 'react';

const validationSchema = yup.object({
    newPassword: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required("Please confirm your password"),
});

export function ResetPassword() {
    const navigate = useNavigate();
    const [Parameters] = useSearchParams();
    const token = Parameters.get('token');
    const email = Parameters.get('email');
    const [loading, setLoading]=useState(true);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: resetPass
    });

    async function resetPass() {
        try {
            const data = await axios.post(
              `${import.meta.env.VITE_API}/Auths/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
                {
                    NewPassword: formik.values.newPassword
                },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (data) {
                toast.success("Password has been changed successfully");
                navigate('/signin');
            }
        } catch (error) {
            toast.error(error.response?.data || "Something went wrong");
        }
    }

        useEffect(() => {
            setLoading(true);
            const delay = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(delay);
        }, []);

    return (
        <>
        {loading ? <Loader/> :
        (<div className={`${style.body}`}>
            <form className={`${style.form}`} onSubmit={formik.handleSubmit}>
                <div className={`${style.imgPassword}`}>
                    <img src={logo} alt="logo" />
                </div>
                <div className='text-center'>
                    <h4>Reset Password</h4>
                </div>
                <div className={`${style.feilds}`}>
                    <div className={`${style.inputcontainer} mb-3`}>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="newPassword">New Password</label>
                        {formik.touched.newPassword && formik.errors.newPassword ? (
                            <div className="text-danger">{formik.errors.newPassword}</div>
                        ) : null}
                    </div>

                    <div className={`${style.inputcontainer} mb-3`}>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder=" "
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="text-danger">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>

                    <button type="submit" className={`${style.PasswordBtn}`}>Save</button>
                </div>
            </form>
        </div>)
        }
        </>
    );
}

// import * as yup from 'yup';
// import { useFormik } from 'formik';
// import style from '../ResetPassword/resetPassword.module.css';
// import logo from '../../../images/logo/logo.png';
// import { toast } from 'react-toastify';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// export function ResetPassword() {
//     const navigate = useNavigate();
//     const [Parameters] = useSearchParams();
//     const token = Parameters.get('token');
//     const email = Parameters.get('email');

//     const formik = useFormik({
//         initialValues: {
//             newPassword: '',
//         },
//         onSubmit: resetPass
//     });

//     async function resetPass() {
//         try {
//             const data = await axios.post(
//                 https://localhost:7024/Auths/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)},
//                 {
//                     NewPassword: formik.values.newPassword
//                 },
//                 { 
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
            
//             if (data) {
//                 toast.success("Password has been changed successfully");
//                 navigate('/signin');
//             }
//         } catch (error) {
//             toast.error(error.response?.data || "Something went wrong");
//         }
//     }

//     return (
//         <div className={${style.body}}>
//             <form className={${style.form}} onSubmit={formik.handleSubmit}>
//                 <div className={${style.imgPassword}}>
//                     <img src={logo} alt="logo" />
//                 </div>
//                 <div className='text-center'>
//                     <h4>Reset Password</h4>
//                 </div>
//                 <div className={${style.feilds}}>
//                     <div className={${style.inputcontainer} mb-3}>
//                         <input
//                             type="password"
//                             id="newPassword"
//                             name="newPassword"
//                             value={formik.values.newPassword}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             placeholder=" "
//                             required
//                         />
//                         <label htmlFor="newPassword">New Password</label>
//                         {formik.touched.newPassword && formik.errors.newPassword ? (
//                             <div className="text-danger">{formik.errors.newPassword}</div>
//                         ) : null}
//                     </div>
//                     <button type="submit" className={${style.PasswordBtn}}>Save</button>
//                 </div>
//             </form>
//         </div>
//     );
// }