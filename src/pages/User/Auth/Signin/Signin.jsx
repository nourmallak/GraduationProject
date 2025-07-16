import * as yup from 'yup';
import { useFormik } from 'formik';
import { jwtDecode } from "jwt-decode";
import style from './signin.module.css';
import logo from '../../../../images/logo/logo.png'
import googleicon from '../../../../images/icons/google.svg'
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../../../context/Context';

export function Signin() {

    const navigate = useNavigate();
    const {setIsLogin} = useContext(UserContext);
    const schema = yup.object(
        {
            email: yup.string().required("Email is required").email("Invalid email format"),
            password: yup.string().required("Password is required")
        }
    )

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: SigninUser,
        validationSchema: schema
    });
 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    async function SigninUser() {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API}/Auths/LogIn`, formik.values);
             if (formik.values.rememberMe) {
                localStorage.setItem("user token", data);
            } else {
                sessionStorage.setItem("user token", data);
                localStorage.setItem("user token", data);
            }
            console.log(data);
            const decoded = jwtDecode(data);
            console.log(decoded);
            setIsLogin(true);
            localStorage.setItem("userRole", decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            console.log("Navigating to home...");
            toast.success('Login successfully', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin") {
                navigate("/dashboard");

            }
          /*  else if(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Sub_Admin") {
                navigate("/DashBoardSubAdmin")
            }*/
            else {
                navigate("/");
            }

        } catch (error) {
            toast.error(error.response.data.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }

    }

    return (
        <>
            <div className={`${style.body}`}>
                <form className={`${style.form}`} onSubmit={formik.handleSubmit}>
                    <div className={`${style.imgSignin}`}>
                        <img src={`${logo}`} />
                    </div>
                    <div className='text-center'>
                        <h2>Sign in</h2>
                        <span>Please login to continue to your account.</span>
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
                        <div className={`${style.inputcontainer} mb-3`}>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="password">Password</label>

                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                        </div>


                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formik.values.rememberMe}
                                onChange={formik.handleChange}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">Keep me logged in</label>

                        </div>

                        <button type="submit" className={`${style.SigninBtn}`}>Sign in</button>
                        <div className={`${style.divider}`}><span>or</span></div>
                        <button type="submit" className={`${style.SigninWithGoogleBtn}  `}>
                            <span>Sign in with Google</span>
                            <img src={googleicon} alt="Google Icon" />
                        </button>
                        <div className={`${style.SigninSuggestion} text-center`}>
                            <Link to='/forgetpassword'>Forget Password?</Link>
                            <br />
                            <Link to='/signup'>Create an Account</Link>
                        </div>
                    </div>
                </form>



            </div>

        </>
    );
}
