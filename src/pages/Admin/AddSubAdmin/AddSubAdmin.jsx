import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../../../images/image/upload_area.svg'
import axios from 'axios'; 
import Swal from 'sweetalert2';
import './AddSubAdmin.css';
import { useNavigate } from 'react-router-dom';

export default function AddSubAdmin() {
  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null); 
  const [universities, setUniversities] = useState([]);
   const navigate = useNavigate();
  const token = localStorage.getItem('user token');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('http://pcpc.runasp.net/University/GetAllUniversitiesforRigister');
        setUniversities(response.data);  
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };
    fetchUniversities();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('Email', data.email);
      formData.append('Password', data.password);
      formData.append('UniversityId', data.university);
      formData.append('Gender', data.gender);
      if (data.image) formData.append('Image', data.image);

      const response = await axios.post(`${import.meta.env.VITE_API}/Auths/Create-SubAdmin-Account`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'SubAdmin added successfully!',
          text: 'The SubAdmin was added successfully.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error!',
          text: 'Something went wrong, but the SubAdmin may have been added.',
        });
      }
       navigate('/dashboard/listadv')

    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        let errorMessage = 'Unknown error occurred.';
    
        // إذا كانت رسالة مباشرة (string)
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
        // إذا كانت تحتوي على خاصية message
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        // إذا كانت مصفوفة أخطاء
        else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.map(err => `• ${err}`).join('<br/>');
        }
        // إذا كانت كائن يحتوي على خصائص متعددة
        else if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `• ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('<br/>');
        }
    
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          html: `<strong>Failed to add SubAdmin</strong><br/><br/>${errorMessage}`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network or Server Error!',
          text: 'There was an error adding the SubAdmin. Please try again.',
        });
      }
    }
    
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
      trigger("image");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='containerAdd my-5-add p-4 border rounded shadow'>
      <h2 className='text-center-add'>Add SubAdmin</h2>

      <div className='d-flex-add align-items-center mb-4-add'>
        <div className='me-3-add'>
          <label htmlFor='adv-img'>
            <img src={imagePreview || logo} className='adv-img-upload' alt='Upload' />
          </label>
          <input 
            type='file' 
            id='adv-img' 
            accept="image/*"
            hidden 
            onChange={handleImageChange} 
          />
        </div>
        <p>Upload your Advister<br />picture.</p>
      </div>
      {errors.image && <p className="error">Image is required</p>}

      <div className='row-add'>
        <div className='col-md-6-add'>
          <label htmlFor='adv-name' className='form-label-add'>Your Name</label>
          <input
            type='text'
            id='adv-name'
            className='form-control-add'
            placeholder='Enter your name'
            {...register('name', { required: true })}
          />
          {errors.name && <p className="error">Name is required</p>}

          <label htmlFor='adv-email' className='form-label-add'>Your Email</label>
          <input
            type='email'
            id='adv-email'
            className='form-control-add'
            placeholder='Enter your email'
            {...register('email', { required: true })}
          />
          {errors.email && <p className="error">Email is required</p>}

          <label htmlFor='adv-password' className='form-label-add'>Your Password</label>
          <input
            type='password'
            id='adv-password'
            className='form-control-add'
            placeholder='Enter your password'
            {...register('password', { required: true })}
          />
          {errors.password && <p className="error">Password is required</p>}
        </div>

        <div className='col-md-6-add'>
          <label htmlFor='adv-university' className='form-label-add'>Your University</label>
          <select
            id='adv-university'
            className='form-control-add'
            {...register('university', { required: true })}
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.universityId} value={university.universityId}>
                {university.name}
              </option>
            ))}
          </select>
          {errors.university && <p className="error">University is required</p>}

          <label htmlFor='adv-gender' className='form-label-add'>Gender</label>
          <select
            id='adv-gender'
            className='form-control-add'
            {...register('gender', { required: true })}
          >
            <option value="">Select Gender</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
          {errors.gender && <p className="error">Gender is required</p>}
        </div>

        <button type='submit' className='btnAddDashBoard'>Add</button>
      </div>
    </form>
  );
}
