import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { LocationDto } from './location.dto';

export class CreateKayakDto {
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
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  cancellationPolicy: string[];

  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  termsAndConditions: string[];

  @IsString()
  kayakType: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  capacity: number;

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
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  modelYear?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  lifeJacketsIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  minimumHours?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  reviewCount?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
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
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  resubmissionCount?: number;
}

export class UpdateKayakDto extends PartialType(CreateKayakDto) {}


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CreateKayakForm = () => {
//   const [form, setForm] = useState<any>({});
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]);

//   // Prefill dummy data
//   useEffect(() => {
//     setForm({
//       title: 'Ocean Explorer Kayak',
//       description: 'Sturdy and safe kayak for all sea adventures.',
//       pricePerHour: '25',
//       pricePerDay: '150',
//       securityDeposit: '50',
//       fuelIncluded: false,
//       insuranceIncluded: true,
//       licenseRequired: false,
//       ageRequirement: '16',
//       cancellationPolicy: '24hr notice,Partial refund',
//       termsAndConditions: 'Wear vest,No rough waters',
//       kayakType: 'Sea',
//       capacity: '1',
//       ownerId: '60f8a4d45a1c2c001c8d4a1f',
//       lat: '24.8615',
//       lng: '67.0099',
//       city: 'Karachi',
//       region: 'Sindh',
//       country: 'Pakistan',
//       address: 'Sandspit Beach, Karachi',
//       tags: 'eco-friendly,single,seaworthy',
//       brand: 'Ocean Kayak',
//       modelYear: '2021',
//       color: 'Yellow',
//       lifeJacketsIncluded: true,
//       minimumHours: '1',
//       maintenanceNotes: 'Inspected monthly',
//       averageRating: '4.7',
//       reviewCount: '12',
//       totalBookings: '30',
//       isFeatured: true,
//       resortId: '60f8b9d45a1c2c001c8d4a2f',
//       status: 'approved',
//       resubmissionCount: '0',
//     });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== '') formData.append(key, value as string);
//     });

//     // Arrays as comma-separated strings
//     formData.set('cancellationPolicy', form.cancellationPolicy);
//     formData.set('termsAndConditions', form.termsAndConditions);
//     if (form.tags) formData.set('tags', form.tags);

//     // Append files
//     images.forEach((img) => formData.append('images', img));
//     videos.forEach((vid) => formData.append('videos', vid));

//     try {
//       const res = await axios.post('http://localhost:8080/products/kayak', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTQzNTY4OSwiZXhwIjoxNzUyMDQwNDg5fQ.8uo-zJuS8oQ7QgUPHkFkYqTzu7gLnqpDKa2hyG0i4rQ',
//         },
//       });

//       console.log(res.data);
//       alert('Kayak created successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create kayak.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} style={{ backgroundColor: 'green' }} />
//       <input type="file" multiple accept="video/*" onChange={(e) => setVideos(Array.from(e.target.files || []))} style={{ backgroundColor: 'red' }} />
//       <button type="submit">Submit Kayak with Dummy Data</button>
//     </form>
//   );
// };

// export default CreateKayakForm;

