import { useForm, Controller, type Resolver, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Organizations } from '../xata';
import { organizationSchema } from '../schema';

export default function CreateOrganization() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Organizations>({
    resolver: zodResolver(organizationSchema),
  });

  // TODO: Geocode address and store lat/long in database

  const onSubmit: SubmitHandler<Organizations> = async (formData) => {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // this could be sent as FormData as well
    });
    const responseData = await response.json();
    if (!response.ok) {
      alert('There was an error creating your organization! Please try again.');
      return;
    }
    if (responseData.errors) {
      const errors = responseData.errors;
      if (errors.name) {
        setError('name', {
          type: 'server',
          message: errors.name,
        });
      } else if (errors.description) {
        setError('description', {
          type: 'server',
          message: errors.description,
        });
      } else if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        });
      } else if (errors.phone) {
        setError('phone', {
          type: 'server',
          message: errors.phone,
        });
      } else {
        alert('There was an error creating your organization! Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg mx-auto p-4'>
      <div className='mb-4'>
        <input
          {...register('name')}
          type='text'
          placeholder='Name'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.name?.message && <span className='text-red-500 text-xs italic'>{errors.name.message}</span>}
      </div>

      <div className='mb-4'>
        <textarea
          placeholder='Description'
          {...register('description')}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        ></textarea>
        {errors.description?.message && (
          <span className='text-red-500 text-xs italic'>{errors.description.message}</span>
        )}
      </div>

      <div className='mb-4'>
        <input
          {...register('website')}
          type='text'
          placeholder='Website URL'
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.website?.message && <span className='text-red-500 text-xs italic'>{errors.website.message}</span>}
      </div>

      <div className='mb-4'>
        <input
          type='email'
          placeholder='Email'
          {...register('email')}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.email?.message && <span className='text-red-500 text-xs italic'>{errors.email.message}</span>}
      </div>

      <div className='mb-6'>
        <input
          type='text'
          placeholder='Phone'
          {...register('phone')}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.phone?.message && <span className='text-red-500 text-xs italic'>{errors.phone.message}</span>}
      </div>

      <div className='mb-6'>
        <input
          type='text'
          placeholder='Address'
          {...register('location.address')}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
        />
        {errors.location?.message && <span className='text-red-500 text-xs italic'>{errors.location.message}</span>}
      </div>

      <div className='flex items-center justify-between'>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Add Organization
        </button>
      </div>
    </form>
  );
}
