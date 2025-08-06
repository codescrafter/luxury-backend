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

export class CreateSpeedboatDto {
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @IsString()
  @IsNotEmpty()
  descriptionAr: string;

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
  cancellationPolicyEn: string[];

  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  cancellationPolicyAr: string[];

  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  termsAndConditionsEn: string[];

  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  termsAndConditionsAr: string[];

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

  @IsMongoId()
  ownerId: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsString()
  cityEn: string;

  @IsString()
  cityAr: string;

  @IsString()
  regionEn: string;

  @IsString()
  regionAr: string;

  @IsString()
  countryEn: string;

  @IsString()
  countryAr: string;

  @IsString()
  addressEn: string;

  @IsString()
  addressAr: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  tagsEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  @IsString({ each: true })
  tagsAr?: string[];

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

export class UpdateSpeedboatDto extends PartialType(CreateSpeedboatDto) {}



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CreateSpeedboatForm = () => {
//   const [form, setForm] = useState<any>({});
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]);

//   useEffect(() => {
//     // Dummy data for CreateSpeedboatDto
//     setForm({
//       title: 'Speedy Wave',
//       description: 'A fast and comfortable speedboat for thrilling rides.',
//       pricePerHour: '150.5',
//       pricePerDay: '1000',
//       securityDeposit: '200',
//       fuelIncluded: true,
//       insuranceIncluded: false,
//       licenseRequired: true,
//       ageRequirement: '18',
//       cancellationPolicy: '48hr notice,full refund',
//       termsAndConditions: 'No smoking,No loud music',
//       engineType: 'V8',
//       enginePower: '450 HP',
//       maxSpeed: '85.5',
//       capacity: '8',
//       ownerId: '60f8a4d45a1c2c001c8d4a1f',
//       lat: '24.8607',
//       lng: '67.0011',
//       city: 'Karachi',
//       region: 'Sindh',
//       country: 'Pakistan',
//       address: 'Beachfront Marina',
//       tags: 'fast,luxury,fun',
//       brand: 'WaveMaster',
//       modelYear: '2021',
//       color: 'red',
//       lifeJacketsIncluded: true,
//       minimumHours: '2',
//       maintenanceNotes: 'Regular servicing every 6 months',
//       averageRating: '4.9',
//       reviewCount: '50',
//       totalBookings: '120',
//       isFeatured: true,
//       resortId: '6864ff4b9e5c2161584f0067',
//       status: 'pending',
//       resubmissionCount: '0',
//     });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = new FormData();

//     // Append number fields
//     const numberFields = [
//       'pricePerHour',
//       'pricePerDay',
//       'securityDeposit',
//       'ageRequirement',
//       'maxSpeed',
//       'capacity',
//       'lat',
//       'lng',
//       'modelYear',
//       'minimumHours',
//       'averageRating',
//       'reviewCount',
//       'totalBookings',
//       'resubmissionCount',
//     ];
//     numberFields.forEach((field) => {
//       if (form[field] !== undefined && form[field] !== '') {
//         formData.append(field, parseFloat(form[field]).toString());
//       }
//     });

//     // Append boolean fields
//     const booleanFields = [
//       'fuelIncluded',
//       'insuranceIncluded',
//       'licenseRequired',
//       'lifeJacketsIncluded',
//       'isFeatured',
//     ];
//     booleanFields.forEach((field) => {
//       if (form[field] !== undefined) {
//         formData.append(field, form[field] ? 'true' : 'false');
//       }
//     });

//     // Append string fields
//     const stringFields = [
//       'title',
//       'description',
//       'engineType',
//       'enginePower',
//       'ownerId',
//       'city',
//       'region',
//       'country',
//       'address',
//       'brand',
//       'color',
//       'maintenanceNotes',
//       'status',
//       'resortId',
//     ];
//     stringFields.forEach((field) => {
//       if (form[field]) {
//         formData.append(field, form[field]);
//       }
//     });

//     // Append arrays (split by comma)
//     const arrayFields = ['cancellationPolicy', 'termsAndConditions', 'tags'];
//     arrayFields.forEach((field) => {
//       if (form[field]) {
//         form[field]
//           .split(',')
//           .map((s: string) => s.trim())
//           .forEach((item: string) => {
//             formData.append(field, item);
//           });
//       }
//     });

//     // Append files
//     images.forEach((img) => formData.append('images', img));
//     videos.forEach((vid) => formData.append('videos', vid));

//     try {
//       const res = await axios.post('http://localhost:8080/products/speedboat', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTQzNTY4OSwiZXhwIjoxNzUyMDQwNDg5fQ.8uo-zJuS8oQ7QgUPHkFkYqTzu7gLnqpDKa2hyG0i4rQ',
//         },
//       });
//       console.log(res.data);
//       alert('Speedboat created successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create speedboat.');
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
//       <button type="submit">Submit Speedboat with Dummy Data</button>
//     </form>
//   );
// };

// export default CreateSpeedboatForm;
