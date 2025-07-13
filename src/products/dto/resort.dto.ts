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
import { Mongoose, Types } from 'mongoose';

export class CreateResortDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAnnualResort: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDailyResort: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  canHostEvent: boolean;

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @Transform(({ value }) => value ? JSON.parse(value) : undefined)
  // amenities?: string[];
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item) => item.length > 0);
  })
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  numberOfRooms?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  numberOfBathrooms?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  totalAreaInSqFt?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  starRating?: number;

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  petFriendly?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  smokingAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  parkingAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  wifiAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  cancellationPolicy?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  termsAndConditions?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  safetyFeatures?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  insuranceProvided?: boolean;

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
  images?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    // If already an array, return as is
    if (Array.isArray(value)) return value;
    // Else split by comma and trim each item
    return value.split(',').map((id: string) => id.trim());
  })
  @IsArray()
  @IsMongoId({ each: true }) // validates each array element as a MongoDB ObjectId
  availableProducts?: string[];


  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  reviewCount?: number;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  resubmissionCount?: number;
}

export class UpdateResortDto extends PartialType(CreateResortDto) {}




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CreateResortForm = () => {
//   const [form, setForm] = useState<any>({});
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]);

//   // Prefill dummy data
//   useEffect(() => {
//     setForm({
//       name: 'Sunset Paradise Resort',
//       description: 'A tropical getaway with all the amenities you could dream of.',
//       isAnnualResort: true,
//       isDailyResort: true,
//       canHostEvent: false,
//       amenities: 'pool,spa,bar,restaurant',
//       numberOfRooms: '120',
//       numberOfBathrooms: '120',
//       totalAreaInSqFt: '50000',
//       starRating: '4.8',
//       checkInTime: '14:00',
//       checkOutTime: '11:00',
//       capacity: '240',
//       petFriendly: true,
//       smokingAllowed: false,
//       parkingAvailable: true,
//       wifiAvailable: true,
//       cancellationPolicy: '72hr notice,50% refund',
//       termsAndConditions: 'No loud music after 10pm,Respect wildlife',
//       safetyFeatures: 'lifeguard,first-aid,kid-zone',
//       insuranceProvided: true,
//       ownerId: '60f8a4d45a1c2c001c8d4a1f',
//       lat: '24.8607',
//       lng: '67.0011',
//       city: 'Karachi',
//       region: 'Sindh',
//       country: 'Pakistan',
//       address: 'Clifton Beach Road',
//       availableProducts: "6864ff4b9e5c2161584f0067",
//       isFeatured: true,
//       averageRating: '4.6',
//       reviewCount: '85',
//       status: 'pending',
//       resubmissionCount: '0',
//     });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     // Helper to append arrays as multiple form fields
//     const appendArrayField = (fieldName: string, value?: string) => {
//       if (value) {
//         value
//           .split(',')
//           .map((s) => s.trim())
//           .forEach((item) => {
//             formData.append(fieldName, item);
//           });
//       }
//     };

//     // Numeric fields to convert to string via parseFloat
//     const numberFields = [
//       'numberOfRooms',
//       'numberOfBathrooms',
//       'totalAreaInSqFt',
//       'starRating',
//       'capacity',
//       'lat',
//       'lng',
//       'averageRating',
//       'reviewCount',
//       'resubmissionCount',
//     ];
//     numberFields.forEach((field) => {
//       if (form[field] !== undefined && form[field] !== '') {
//         formData.append(field, parseFloat(form[field]).toString());
//       }
//     });

//     // Boolean fields to convert to "true"/"false"
//     const booleanFields = [
//       'isAnnualResort',
//       'isDailyResort',
//       'canHostEvent',
//       'petFriendly',
//       'smokingAllowed',
//       'parkingAvailable',
//       'wifiAvailable',
//       'insuranceProvided',
//       'isFeatured',
//     ];
//     booleanFields.forEach((field) => {
//       if (form[field] !== undefined) {
//         formData.append(field, form[field] ? 'true' : 'false');
//       }
//     });

//     // Simple string fields
//     const stringFields = [
//       'name',
//       'description',
//       'checkInTime',
//       'checkOutTime',
//       'ownerId',
//       'city',
//       'region',
//       'country',
//       'address',
//       'status',
//       'availableProducts'
//     ];
//     stringFields.forEach((field) => {
//       if (form[field]) {
//         formData.append(field, form[field]);
//       }
//     });

//     // Append arrays properly
//     appendArrayField('amenities', form.amenities);
//     appendArrayField('cancellationPolicy', form.cancellationPolicy);
//     appendArrayField('termsAndConditions', form.termsAndConditions);
//     appendArrayField('safetyFeatures', form.safetyFeatures);
  

//     // Append files
//     images.forEach((img) => formData.append('images', img));
//     videos.forEach((vid) => formData.append('videos', vid));

//     try {
//       const res = await axios.post('http://localhost:8080/products/resort', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTQzNTY4OSwiZXhwIjoxNzUyMDQwNDg5fQ.8uo-zJuS8oQ7QgUPHkFkYqTzu7gLnqpDKa2hyG0i4rQ',
//         },
//       });

//       console.log(res.data);
//       alert('Resort created successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create resort.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={(e) => setImages(Array.from(e.target.files || []))}
//         style={{ backgroundColor: '#06C755', marginBottom: 8 }}
//       />
//       <input
//         type="file"
//         multiple
//         accept="video/*"
//         onChange={(e) => setVideos(Array.from(e.target.files || []))}
//         style={{ backgroundColor: '#424242', marginBottom: 16 }}
//       />
//       <button type="submit">Submit Resort with Dummy Data</button>
//     </form>
//   );
// };

// export default CreateResortForm;
