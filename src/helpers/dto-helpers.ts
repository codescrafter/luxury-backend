import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const phoneValidationRegex = /^\+[1-9]\d{1,14}$/;
export const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
export class IsEmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return emailValidationRegex.test(value) || phoneValidationRegex.test(value);
  }
  defaultMessage() {
    return 'The value must be a valid email address or phone number.';
  }
}

export function transformProductForLanguage(product: any, lang: string = 'en') {
  if (!product) return product;

  // Convert Mongoose document to plain object if needed
  const plainProduct = product.toObject ? product.toObject() : product;
  const transformed = { ...plainProduct };

  // Transform title and description based on language
  if (lang === 'ar') {
    transformed.title = product.titleAr || product.titleEn || product.title;
    transformed.description =
      product.descriptionAr || product.descriptionEn || product.description;
  } else {
    transformed.title = product.titleEn || product.titleAr || product.title;
    transformed.description =
      product.descriptionEn || product.descriptionAr || product.description;
  }

  // Transform cancellation policy
  if (lang === 'ar') {
    transformed.cancellationPolicy =
      product.cancellationPolicyAr ||
      product.cancellationPolicyEn ||
      product.cancellationPolicy;
  } else {
    transformed.cancellationPolicy =
      product.cancellationPolicyEn ||
      product.cancellationPolicyAr ||
      product.cancellationPolicy;
  }

  // Transform terms and conditions
  if (lang === 'ar') {
    transformed.termsAndConditions =
      product.termsAndConditionsAr ||
      product.termsAndConditionsEn ||
      product.termsAndConditions;
  } else {
    transformed.termsAndConditions =
      product.termsAndConditionsEn ||
      product.termsAndConditionsAr ||
      product.termsAndConditions;
  }

  // Transform location fields
  if (lang === 'ar') {
    transformed.city = product.cityAr || product.cityEn || product.city;
    transformed.region = product.regionAr || product.regionEn || product.region;
    transformed.country =
      product.countryAr || product.countryEn || product.country;
    transformed.address =
      product.addressAr || product.addressEn || product.address;
  } else {
    transformed.city = product.cityEn || product.cityAr || product.city;
    transformed.region = product.regionEn || product.regionAr || product.region;
    transformed.country =
      product.countryEn || product.countryAr || product.country;
    transformed.address =
      product.addressEn || product.addressAr || product.address;
  }

  // Transform tags
  if (lang === 'ar') {
    transformed.tags = product.tagsAr || product.tagsEn || product.tags;
  } else {
    transformed.tags = product.tagsEn || product.tagsAr || product.tags;
  }

  // Transform amenities (for resorts)
  if (product.amenitiesEn || product.amenitiesAr) {
    if (lang === 'ar') {
      transformed.amenities =
        product.amenitiesAr || product.amenitiesEn || product.amenities;
    } else {
      transformed.amenities =
        product.amenitiesEn || product.amenitiesAr || product.amenities;
    }
  }

  // Transform safety features (for resorts)
  if (product.safetyFeaturesEn || product.safetyFeaturesAr) {
    if (lang === 'ar') {
      transformed.safetyFeatures =
        product.safetyFeaturesAr ||
        product.safetyFeaturesEn ||
        product.safetyFeatures;
    } else {
      transformed.safetyFeatures =
        product.safetyFeaturesEn ||
        product.safetyFeaturesAr ||
        product.safetyFeatures;
    }
  }

  // Remove the language-specific fields from the response
  delete transformed.titleEn;
  delete transformed.titleAr;
  delete transformed.descriptionEn;
  delete transformed.descriptionAr;
  delete transformed.cancellationPolicyEn;
  delete transformed.cancellationPolicyAr;
  delete transformed.termsAndConditionsEn;
  delete transformed.termsAndConditionsAr;
  delete transformed.cityEn;
  delete transformed.cityAr;
  delete transformed.regionEn;
  delete transformed.regionAr;
  delete transformed.countryEn;
  delete transformed.countryAr;
  delete transformed.addressEn;
  delete transformed.addressAr;
  delete transformed.tagsEn;
  delete transformed.tagsAr;
  delete transformed.amenitiesEn;
  delete transformed.amenitiesAr;
  delete transformed.safetyFeaturesEn;
  delete transformed.safetyFeaturesAr;

  return transformed;
}

export function transformProductsArrayForLanguage(
  products: any[],
  lang: string = 'en',
) {
  return products
    .filter((product) => product) // Filter out null/undefined products
    .map((product) => transformProductForLanguage(product, lang));
}

/**
 * Transform product to include both languages in response
 * This function preserves both language fields and adds a 'displayLang' field
 */
export function transformProductForDualLanguage(
  product: any,
  displayLang?: string,
) {
  if (!product) return product;

  // Convert Mongoose document to plain object if needed
  const plainProduct = product.toObject ? product.toObject() : product;
  const transformed = { ...plainProduct };

  // If no displayLang specified, don't set display fields
  if (!displayLang) {
    // Remove display fields to force frontend to use language-specific fields
    delete transformed.title;
    delete transformed.description;
    delete transformed.cancellationPolicy;
    delete transformed.termsAndConditions;
    delete transformed.city;
    delete transformed.region;
    delete transformed.country;
    delete transformed.address;
    delete transformed.tags;
    delete transformed.amenities;
    delete transformed.safetyFeatures;
    return transformed;
  }

  // Add display language field
  transformed.displayLang = displayLang;

  // Set the display title and description based on displayLang
  if (displayLang === 'ar') {
    transformed.title = product.titleAr || product.titleEn || product.title;
    transformed.description =
      product.descriptionAr || product.descriptionEn || product.description;
  } else {
    transformed.title = product.titleEn || product.titleAr || product.title;
    transformed.description =
      product.descriptionEn || product.descriptionAr || product.description;
  }

  // Set the display cancellation policy
  if (displayLang === 'ar') {
    transformed.cancellationPolicy =
      product.cancellationPolicyAr ||
      product.cancellationPolicyEn ||
      product.cancellationPolicy;
  } else {
    transformed.cancellationPolicy =
      product.cancellationPolicyEn ||
      product.cancellationPolicyAr ||
      product.cancellationPolicy;
  }

  // Set the display terms and conditions
  if (displayLang === 'ar') {
    transformed.termsAndConditions =
      product.termsAndConditionsAr ||
      product.termsAndConditionsEn ||
      product.termsAndConditions;
  } else {
    transformed.termsAndConditions =
      product.termsAndConditionsEn ||
      product.termsAndConditionsAr ||
      product.termsAndConditions;
  }

  // Set the display location fields
  if (displayLang === 'ar') {
    transformed.city = product.cityAr || product.cityEn || product.city;
    transformed.region = product.regionAr || product.regionEn || product.region;
    transformed.country =
      product.countryAr || product.countryEn || product.country;
    transformed.address =
      product.addressAr || product.addressEn || product.address;
  } else {
    transformed.city = product.cityEn || product.cityAr || product.city;
    transformed.region = product.regionEn || product.regionAr || product.region;
    transformed.country =
      product.countryEn || product.countryAr || product.country;
    transformed.address =
      product.addressEn || product.addressAr || product.address;
  }

  // Set the display tags
  if (displayLang === 'ar') {
    transformed.tags = product.tagsAr || product.tagsEn || product.tags;
  } else {
    transformed.tags = product.tagsEn || product.tagsAr || product.tags;
  }

  // Set the display amenities (for resorts)
  if (product.amenitiesEn || product.amenitiesAr) {
    if (displayLang === 'ar') {
      transformed.amenities =
        product.amenitiesAr || product.amenitiesEn || product.amenities;
    } else {
      transformed.amenities =
        product.amenitiesEn || product.amenitiesAr || product.amenities;
    }
  }

  // Set the display safety features (for resorts)
  if (product.safetyFeaturesEn || product.safetyFeaturesAr) {
    if (displayLang === 'ar') {
      transformed.safetyFeatures =
        product.safetyFeaturesAr ||
        product.safetyFeaturesEn ||
        product.safetyFeatures;
    } else {
      transformed.safetyFeatures =
        product.safetyFeaturesEn ||
        product.safetyFeaturesAr ||
        product.safetyFeatures;
    }
  }

  // Keep both language fields in the response for dual-language support
  // This allows frontend to switch languages without additional API calls

  return transformed;
}

/**
 * Transform products array to include both languages in response
 */
export function transformProductsArrayForDualLanguage(
  products: any[],
  displayLang: string = 'en',
) {
  return products
    .filter((product) => product) // Filter out null/undefined products
    .map((product) => transformProductForDualLanguage(product, displayLang));
}
