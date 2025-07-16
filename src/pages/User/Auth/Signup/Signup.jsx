import * as yup from 'yup';
import { useFormik } from 'formik';
import style from '../Signup/signup.module.css';
import logo from '../../../../images/logo/logo.png'
import googleicon from '../../../../images/icons/google.svg'
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../../../Loader/Loader';
import { useEffect, useState } from 'react';

export function Signup() {

    const [loading, setLoading] = useState(true);
    const [universities, setUniversities] = useState([]);
    const navigate = useNavigate();
    const schema = yup.object(
        {
            email: yup.string().required("Email is required").email("Invalid email format"),
            password: yup.string().required("Password is required").min(9, "Password must be at least 9 characters")
        }
    )

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            universityName: '',
            gender: ''
        },
        onSubmit: SignupUser,
        validationSchema: schema
    });

    async function SignupUser() {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API}/Auths/Register`, formik.values);
            console.log(data);
            toast.success('Check Your Email Please!', {
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
            navigate('/signin');

        } catch (error) {
            toast.error(error.response.data, {
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

    useEffect(() => {
        setLoading(true);
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API}/University/GetAllUniversitiesforRigister`);
                setUniversities(response.data);
            } catch (error) {
                console.error("Error fetching universities:", error);
            }
        };

        fetchUniversities().finally(() => {
            setTimeout(() => setLoading(false), 1500);
        });
    }, []);

    return (
        <>
            {loading ? <Loader /> :
                <div className={`${style.body}`}>
                    <form className={`${style.form}`} onSubmit={formik.handleSubmit}>
                        <div className={`${style.imgSignup}`}>
                            <img src={`${logo}`} />
                        </div>
                        <div className='text-center'>
                            <h2>Sign up</h2>
                            <span>Sign up to enjoy the advantage of joining the community</span>
                        </div>

                        <div className={`${style.inputcontainer} mb-3`}>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="name">User Name</label>

                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-danger">{formik.errors.name}</div>
                            ) : null}
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

                            <div className={`${style.inputcontainer} mb-3`}>
                                <select
                                    id="universityId"
                                    name="universityId"
                                    value={formik.values.universityId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                >
                                    <option value=""  >Select your university</option>
                                    {universities.map(university => (
                                        <option key={university.universityId} value={university.universityId}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>

                                {formik.touched.universityId && formik.errors.universityId ? (
                                    <div className="text-danger">{formik.errors.universityId}</div>
                                ) : null}
                            </div>

                            <div className={`${style.inputcontainer} mb-3`}>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    onChange={(e) => formik.setFieldValue("gender", Number(e.target.value))}
                                >
                                    <option value="" disabled>
                                        Select your gender
                                    </option>
                                    <option value={0} >Male</option>
                                    <option value={1} >Female</option>
                                </select>

                                {formik.touched.gender && formik.errors.gender ? (
                                    <div className="text-danger">{formik.errors.gender}</div>
                                ) : null}
                            </div>


                            <button type="submit" className={`${style.SignupBtn}`}>Sign up</button>
                            <div className={`${style.divider}`}><span>or</span></div>
                            <button type="submit" className={`${style.SignupWithGoogleBtn}  `}>
                                <span>Continue with Google</span>
                                <img src={googleicon} alt="Google Icon" />
                            </button>
                            <div className={`${style.SignupSuggestion} text-center`}>
                                <span>Already have an account?</span> <Link to='./signin'>Sign in</Link>
                            </div>
                        </div>
                    </form>



                </div>
            }

        </>
    );
}
