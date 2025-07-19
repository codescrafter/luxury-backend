// To run the end-to-end product status flow:
// 1. Use the Partner token to create a product.
// 2. Use the Admin token to approve or reject the product.
// 3. Use the appropriate token to fetch products by status.
// Switch the AUTH_TOKEN value as needed for each step.

const path = require("path");
const fs = require("fs");

function createTestImage() {
  const testImagePath = path.join(__dirname, 'test-image.png');
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xCF, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  fs.writeFileSync(testImagePath, pngBuffer);
  return testImagePath;
}


module.exports = {
  BASE_URL: 'http://localhost:8080',
  OWNER_ID: '686498e3302575e332037312',
  createTestImage,
  PARTNER_1_TOKEN:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzAyMDkxMjczZTAwOGVlNWJlOWI5NSIsImlhdCI6MTc1Mjg2NDcyNSwiZXhwIjoxNzUzNDY5NTI1fQ.80yBCdCoMXsThz43LYDxr2-hzl0253gkII955phfUVA',
  PARTNER_2_TOKEN:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzAyNmVkMjczZTAwOGVlNWJlOWI5OSIsImlhdCI6MTc1Mjg2NTE0OSwiZXhwIjoxNzUzNDY5OTQ5fQ.RyXc7XgKQT-t-Ba5BlfN9xRN9QUgqQ3adZY2Q4Lc7xc',
  ADMIN_TOKEN:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjQ5OGUzMzAyNTc1ZTMzMjAzNzMxMiIsImlhdCI6MTc1Mjg2NDY4NiwiZXhwIjoxNzUzNDY5NDg2fQ.IzEq6s54bo_BFYaOXlkqz1Rk39HUVrqMeq92b6TqTtE',
  USER_TOKEN:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzAyMWIyMjczZTAwOGVlNWJlOWI5NyIsImlhdCI6MTc1MjkxNjAzNywiZXhwIjoxNzUzNTIwODM3fQ.a06Xh2BUnwbZrviaEsI4rqPdFm5PzHRpS8fuLuJbGmU'
}; 
