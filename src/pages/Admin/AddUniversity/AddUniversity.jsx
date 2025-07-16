import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AddUniversity.css';

export default function AddUniversity() {
  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm();
  const [imagePreview, setImagePreview] = useState(null); 
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('user token');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('location', data.location);
      formData.append('url', data.url);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('ShortName', data.shortName);

      if (data.logo) {
        formData.append('logo', data.logo);
      } else {
        console.log('Logo is missing!');
      }

      if (data.imageName && data.imageName[0]) {
        formData.append('imageName', data.imageName[0]);
      } else {
        console.log('Image is missing!');
      }

      const response = await axios.post(`${import.meta.env.VITE_API}/University/Add-University`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      const universityId = response.data.universityId;
      if (!universityId) throw new Error("No university ID returned from server");

      Swal.fire({
        icon: 'success',
        title: 'University added successfully!',
        text: 'The university was added successfully to the system.',
      }).then(() => {
        navigate(`/dashboard/addimages/${universityId}`);
      });

    } catch (error) {
      console.error('Error adding University:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response ? error.response.data.message : 'There was an error adding the University. Please try again.',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); 
      setValue("imageName", file); 
      trigger("imageName"); 
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file)); 
      setValue("logo", file); 
      trigger("logo"); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='containerAdd my-5-add p-4 border rounded shadow'>
      <h2 className='text-center-add'>Add University</h2>
      <div className='d-flex-add align-items-center mb-4-add'>
        <div className='me-3-add'>
          <label htmlFor='adv-logo'>
            <img src={logoPreview || '/upload_area.svg'} className='adv-img-upload' alt='Upload logo preview' />
          </label>
          <input 
            type='file' 
            id='adv-logo' 
            accept="image/*"
            hidden 
            onChange={handleLogoChange} 
          />
        </div>
        <p>Upload the university logo</p>
      </div>
      {errors.logo && <p className="error">Logo is required</p>}

      <div className='row-add'>
        <div className='col-md-6-add'>
          <label htmlFor='adv-name' className='form-label-add'>Name</label>
          <input
            type='text'
            id='adv-name'
            className='form-control-add'
            placeholder='Enter the name'
            {...register('name', { required: true })}
          />
          {errors.name && <p className="error">Name is required</p>}

          <label htmlFor='adv-description' className='form-label-add'>Description</label>
          <textarea
            id='adv-description'
            className='form-control-add'
            placeholder='Enter a description'
            {...register('description', { required: true })}
          />
          {errors.description && <p className="error">Description is required</p>}

          <label htmlFor='adv-shortname' className='form-label-add'>Short Name</label>
          <input
            type='text'
            id='adv-shortname'
            className='form-control-add'
            placeholder='Enter the short name'
            {...register('shortName', { required: true })}
          />
          {errors.shortName && <p className="error">Short name is required</p>}

          <label htmlFor='adv-image' className='form-label-add'>Main Image</label>
          <input
            type='file'
            id='adv-image'
            className='form-control-add'
            accept="image/*"
            onChange={handleImageChange} 
            {...register('imageName', { required: true })}
          />
          {errors.imageName && <p className="error">Main image is required</p>}
        </div>

        <div className='col-md-6-add'>
          <label htmlFor='adv-location' className='form-label-add'>Location</label>
          <input
            type='text'
            id='adv-location'
            className='form-control-add'
            placeholder='Enter the location'
            {...register('location', { required: true })}
          />
          {errors.location && <p className="error">Location is required</p>}

          <label htmlFor='adv-url' className='form-label-add'>Official Website</label>
          <input
            type='url'
            id='adv-url'
            className='form-control-add'
            placeholder='Enter the official website URL'
            {...register('url', { required: true })}
          />
          {errors.url && <p className="error">Website URL is required</p>}

          <label htmlFor='adv-phone' className='form-label-add'>Phone Number</label>
          <input
            type='tel'
            id='adv-phone'
            className='form-control-add'
            placeholder='Enter the phone number'
            {...register('phoneNumber', { required: true })}
          />
          {errors.phoneNumber && <p className="error">Phone number is required</p>}
        </div>
      </div>
      <button type='submit' className='btnAddDashBoard'>Add University</button>
    </form>
  );
}
