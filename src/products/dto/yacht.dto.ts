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

export class CreateYachtDto {
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

  @IsString()
  yachtType: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lengthInFeet: number;

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
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  crewIncluded?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  captainIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  numberOfCabins?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  modelYear?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  luxuryFeaturesIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minimumHours?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

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

export class UpdateYachtDto extends PartialType(CreateYachtDto) {}

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CreateYachtForm = () => {
//   const [form, setForm] = useState<any>({});
//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]); // Remove if not applicable

//   useEffect(() => {
//     setForm({
//       title: 'Luxury Ocean Pearl',
//       description: 'Experience ultimate luxury on the water with this premium yacht.',
//       pricePerHour: '500',
//       pricePerDay: '3500',
//       securityDeposit: '1000',
//       fuelIncluded: true,
//       insuranceIncluded: true,
//       licenseRequired: false,
//       ageRequirement: '21',
//       cancellationPolicy: '72hr notice,50% refund',
//       termsAndConditions: 'No pets,No smoking on deck',
//       yachtType: 'Motor Yacht',
//       lengthInFeet: '120',
//       capacity: '20',
//       ownerId: '60f8a4d45a1c2c001c8d4a1f',
//       lat: '24.8607',
//       lng: '67.0011',
//       city: 'Karachi',
//       region: 'Sindh',
//       country: 'Pakistan',
//       address: 'Harbor Marina',
//       tags: 'luxury,party,family',
//       crewIncluded: true,
//       captainIncluded: true,
//       numberOfCabins: '8',
//       numberOfBathrooms: '6',
//       brand: 'OceanMaster',
//       modelYear: '2022',
//       color: 'white',
//       luxuryFeaturesIncluded: true,
//       minimumHours: '4',
//       maintenanceNotes: 'Serviced quarterly, always clean',
//       averageRating: '4.9',
//       reviewCount: '75',
//       totalBookings: '200',
//       isFeatured: true,
//       resortId: '6864ff4b9e5c2161584f0067',
//       status: 'pending',
//       resubmissionCount: '0',
//     });
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formData = new FormData();

//     // Number fields (parseFloat or parseInt)
//     const numberFields = [
//       'pricePerHour',
//       'pricePerDay',
//       'securityDeposit',
//       'ageRequirement',
//       'lengthInFeet',
//       'capacity',
//       'lat',
//       'lng',
//       'numberOfCabins',
//       'numberOfBathrooms',
//       'modelYear',
//       'minimumHours',
//       'averageRating',
//       'reviewCount',
//       'totalBookings',
//       'resubmissionCount',
//     ];
//     numberFields.forEach((field) => {
//       if (form[field] !== undefined && form[field] !== '') {
//         // parseInt if field implies int, else parseFloat
//         const intFields = ['ageRequirement', 'capacity', 'numberOfCabins', 'numberOfBathrooms', 'modelYear', 'reviewCount', 'totalBookings', 'resubmissionCount'];
//         if (intFields.includes(field)) {
//           formData.append(field, parseInt(form[field]).toString());
//         } else {
//           formData.append(field, parseFloat(form[field]).toString());
//         }
//       }
//     });

//     // Boolean fields
//     const booleanFields = [
//       'fuelIncluded',
//       'insuranceIncluded',
//       'licenseRequired',
//       'crewIncluded',
//       'captainIncluded',
//       'luxuryFeaturesIncluded',
//       'isFeatured',
//     ];
//     booleanFields.forEach((field) => {
//       if (form[field] !== undefined) {
//         formData.append(field, form[field] ? 'true' : 'false');
//       }
//     });

//     // String fields
//     const stringFields = [
//       'title',
//       'description',
//       'yachtType',
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

//     // Arrays (split by comma)
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

//     // Append files if your API supports (remove if not applicable)
//     images.forEach((img) => formData.append('images', img));
//     videos.forEach((vid) => formData.append('videos', vid));

//     try {
//       const res = await axios.post('http://localhost:8080/products/yacht', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1MTQzNTY4OSwiZXhwIjoxNzUyMDQwNDg5fQ.8uo-zJuS8oQ7QgUPHkFkYqTzu7gLnqpDKa2hyG0i4rQ',
//         },
//       });
//       console.log(res.data);
//       alert('Yacht created successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to create yacht.');
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
//       <button type="submit">Submit Yacht with Dummy Data</button>
//     </form>
//   );
// };

// export default CreateYachtForm;
