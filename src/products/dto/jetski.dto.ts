import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateJetskiDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerHour: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerDay: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  securityDeposit: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  fuelIncluded: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  insuranceIncluded: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  licenseRequired: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  ageRequirement: number;

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  cancellationPolicy: string[];

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  termsAndConditions: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  engineType: string;

  @IsString()
  enginePower: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxSpeed: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  capacity: number;

  @IsString()
  brand: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  modelYear?: number;

  @IsOptional()
  @IsString()
  jetskiType?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  lifeJacketsIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minimumHours?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

  @IsMongoId()
  ownerId: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsString()
  city: string;
  @IsString()
  region: string;
  @IsString()
  country: string;
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  reviewCount?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  totalBookings?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  resubmissionCount?: number;
}

export class UpdateJetskiDto extends PartialType(CreateJetskiDto) {}



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CreateJetskiForm = () => {
//   const [form, setForm] = useState<any>({});
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]);

//   // Prefill dummy data
//   useEffect(() => {
//     setForm({
//       title: 'Super Jet 3000',
//       description: 'A fast and fun jetski for all your water adventures.',
//       pricePerHour: '50',
//       pricePerDay: '300',
//       securityDeposit: '100',
//       fuelIncluded: true,
//       insuranceIncluded: true,
//       licenseRequired: false,
//       ageRequirement: '18',
//       cancellationPolicy: 'No refunds,Reschedule allowed',
//       termsAndConditions: 'Wear safety gear,No alcohol',
//       tags: 'fast,fun,family',
//       engineType: '4-stroke',
//       enginePower: '180 HP',
//       maxSpeed: '90',
//       capacity: '2',
//       brand: 'Yamaha',
//       modelYear: '2022',
//       jetskiType: 'Recreational',
//       color: 'Blue',
//       lifeJacketsIncluded: true,
//       minimumHours: '2',
//       maintenanceNotes: 'Regularly maintained every month',
//       ownerId: '60f8a4d45a1c2c001c8d4a1f', // example MongoID
//       lat: '24.8607',
//       lng: '67.0011',
//       city: 'Karachi',
//       region: 'Sindh',
//       country: 'Pakistan',
//       address: 'Clifton Beach, Karachi',
//       averageRating: '4.5',
//       reviewCount: '20',
//       totalBookings: '50',
//       isFeatured: true,
//       resortId: '60f8b9d45a1c2c001c8d4a2f', // example MongoID
//       status: 'approved',
//       resubmissionCount: '1',
//     });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== '') formData.append(key, value as string);
//     });

//     // Convert arrays from string
//     formData.set('cancellationPolicy', form.cancellationPolicy);
//     formData.set('termsAndConditions', form.termsAndConditions);
//     form.tags && formData.set('tags', form.tags);

//     images.forEach((img) => formData.append('images', img));
//     videos.forEach((vid) => formData.append('videos', vid));

//     try {
//       const res = await axios.post('http://localhost:8080/products/jetski', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTQzNTY4OSwiZXhwIjoxNzUyMDQwNDg5fQ.8uo-zJuS8oQ7QgUPHkFkYqTzu7gLnqpDKa2hyG0i4rQ',
//         },
//       });

//       console.log(res.data);
//       alert('Jetski created successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create jetski.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} style={{backgroundColor:"green"}} />
//       <input type="file" multiple onChange={(e) => setVideos(Array.from(e.target.files || []))} style={{backgroundColor:"red"}} />
//       <button type="submit">Submit Jetski with Dummy Data</button>
//     </form>
//   );
// };

// export default CreateJetskiForm;
