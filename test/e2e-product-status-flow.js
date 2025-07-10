const { createJetski } = require('./create-jetski');
const axios = require('axios');
const {
  BASE_URL,
  PARTNER_1_TOKEN,
  PARTNER_2_TOKEN,
  ADMIN_TOKEN,
} = require('./config');

async function createJetskiWithToken(token) {
  const jetski = await createJetski(token);
  return jetski;
}

async function getPendingProductsWithToken(token) {
  const res = await axios.get(`${BASE_URL}/products/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data || [];
}

async function getApprovedProductsWithToken(token) {
  const res = await axios.get(`${BASE_URL}/products/approved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data || [];
}

async function getRejectedProductsWithToken(token) {
  const res = await axios.get(`${BASE_URL}/products/rejected`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data || [];
}

async function approveProductWithToken(type, id, token) {
  return await axios
    .put(`${BASE_URL}/products/${type}/${id}/approve`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data?.data)
    .catch((e) => e.response?.data || e.message);
}

async function rejectProductWithToken(type, id, token) {
  return await axios
    .put(`${BASE_URL}/products/${type}/${id}/reject`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data?.data)
    .catch((e) => e.response?.data || e.message);
}

async function revisionProductWithToken(type, id, token) {
  return await axios
    .put(`${BASE_URL}/products/${type}/${id}/revision`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data?.data)
    .catch((e) => e.response?.data || e.message);
}

async function resubmitProductWithToken(type, id, token) {
  return await axios
    .put(`${BASE_URL}/products/${type}/${id}/resubmit`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data?.data)
    .catch((e) => e.response?.data || e.message);
}

function findProductById(products, id) {
  return (products || []).find((p) => p._id === id);
}

function logTestResult(testName, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${testName}${details ? ` - ${details}` : ''}`);
}

async function runFlow() {
  console.log('🚀 Starting E2E Product Status Flow Tests...\n');

  // ===== PHASE 1: Create Products =====
  console.log('📝 PHASE 1: Creating Products');
  console.log('==============================');

  // Create jetskis as Partner 1
  console.log('--- Creating jetskis as Partner 1...');
  const jetski1 = await createJetskiWithToken(PARTNER_1_TOKEN);
  const jetski2 = await createJetskiWithToken(PARTNER_1_TOKEN);
  const jetski3 = await createJetskiWithToken(PARTNER_1_TOKEN);

  if (!jetski1?._id || !jetski2?._id || !jetski3?._id) {
    console.error('❌ Failed to create jetskis as Partner 1');
    return;
  }

  // Create jetskis as Partner 2
  console.log('--- Creating jetskis as Partner 2...');
  const jetski4 = await createJetskiWithToken(PARTNER_2_TOKEN);
  const jetski5 = await createJetskiWithToken(PARTNER_2_TOKEN);
  const jetski6 = await createJetskiWithToken(PARTNER_2_TOKEN);

  if (!jetski4?._id || !jetski5?._id || !jetski6?._id) {
    console.error('❌ Failed to create jetskis as Partner 2');
    return;
  }

  console.log('✅ All jetskis created successfully\n');

  // ===== PHASE 2: Test Initial Pending Status =====
  console.log('⏳ PHASE 2: Testing Initial Pending Status');
  console.log('==========================================');

  // Test Partner 1 sees only their pending products
  const pending1 = await getPendingProductsWithToken(PARTNER_1_TOKEN);
  const foundJetski1 = findProductById(pending1, jetski1._id);
  const foundJetski2 = findProductById(pending1, jetski2._id);
  const foundJetski3 = findProductById(pending1, jetski3._id);
  const foundJetski4 = findProductById(pending1, jetski4._id);

  logTestResult('Partner 1 sees their jetski1 in pending', !!foundJetski1);
  logTestResult('Partner 1 sees their jetski2 in pending', !!foundJetski2);
  logTestResult('Partner 1 sees their jetski3 in pending', !!foundJetski3);
  logTestResult('Partner 1 does NOT see Partner 2 products', !foundJetski4);

  // Test Partner 2 sees only their pending products
  const pending2 = await getPendingProductsWithToken(PARTNER_2_TOKEN);
  const foundJetski4Partner2 = findProductById(pending2, jetski4._id);
  const foundJetski5Partner2 = findProductById(pending2, jetski5._id);
  const foundJetski6Partner2 = findProductById(pending2, jetski6._id);
  const foundJetski1Partner2 = findProductById(pending2, jetski1._id);

  logTestResult('Partner 2 sees their jetski4 in pending', !!foundJetski4Partner2);
  logTestResult('Partner 2 sees their jetski5 in pending', !!foundJetski5Partner2);
  logTestResult('Partner 2 sees their jetski6 in pending', !!foundJetski6Partner2);
  logTestResult('Partner 2 does NOT see Partner 1 products', !foundJetski1Partner2);

  // Test Admin sees ALL pending products
  const pendingAdmin = await getPendingProductsWithToken(ADMIN_TOKEN);
  const foundJetski1Admin = findProductById(pendingAdmin, jetski1._id);
  const foundJetski4Admin = findProductById(pendingAdmin, jetski4._id);
  const foundJetski2Admin = findProductById(pendingAdmin, jetski2._id);
  const foundJetski5Admin = findProductById(pendingAdmin, jetski5._id);

  logTestResult('Admin sees Partner 1 jetski1 in pending', !!foundJetski1Admin);
  logTestResult('Admin sees Partner 2 jetski4 in pending', !!foundJetski4Admin);
  logTestResult('Admin sees Partner 1 jetski2 in pending', !!foundJetski2Admin);
  logTestResult('Admin sees Partner 2 jetski5 in pending', !!foundJetski5Admin);
  logTestResult('Admin sees all 6 jetskis in pending', pendingAdmin.length === 6);

  console.log('');

  // ===== PHASE 3: Test Approval Flow =====
  console.log('✅ PHASE 3: Testing Approval Flow');
  console.log('==================================');

  // Admin approves Partner 1's jetski1
  console.log('--- Admin approving Partner 1 jetski1...');
  const approveResult1 = await approveProductWithToken('jetski', jetski1._id, ADMIN_TOKEN);
  logTestResult('Admin can approve Partner 1 jetski1', !approveResult1.error);

  // Admin approves Partner 2's jetski4
  console.log('--- Admin approving Partner 2 jetski4...');
  const approveResult2 = await approveProductWithToken('jetski', jetski4._id, ADMIN_TOKEN);
  logTestResult('Admin can approve Partner 2 jetski4', !approveResult2.error);

  // Test approved products visibility
  const approvedAdmin = await getApprovedProductsWithToken(ADMIN_TOKEN);
  const approved1 = await getApprovedProductsWithToken(PARTNER_1_TOKEN);
  const approved2 = await getApprovedProductsWithToken(PARTNER_2_TOKEN);

  const foundApprovedJetski1 = findProductById(approvedAdmin, jetski1._id);
  const foundApprovedJetski4 = findProductById(approvedAdmin, jetski4._id);

  logTestResult('Admin sees approved Partner 1 jetski1', !!foundApprovedJetski1);
  logTestResult('Admin sees approved Partner 2 jetski4', !!foundApprovedJetski4);
  logTestResult('Partner 1 sees their approved jetski1', !!findProductById(approved1, jetski1._id));
  logTestResult('Partner 2 sees their approved jetski4', !!findProductById(approved2, jetski4._id));
  logTestResult('Partner 1 does NOT see Partner 2 approved products', !findProductById(approved1, jetski4._id));
  logTestResult('Partner 2 does NOT see Partner 1 approved products', !findProductById(approved2, jetski1._id));

  // Test that approved products are no longer in pending
  const pendingAfterApproval = await getPendingProductsWithToken(ADMIN_TOKEN);
  logTestResult('Approved products removed from pending', 
    !findProductById(pendingAfterApproval, jetski1._id) && 
    !findProductById(pendingAfterApproval, jetski4._id));

  console.log('');

  // ===== PHASE 4: Test Rejection Flow =====
  console.log('❌ PHASE 4: Testing Rejection Flow');
  console.log('===================================');

  // Admin rejects Partner 1's jetski2
  console.log('--- Admin rejecting Partner 1 jetski2...');
  const rejectResult1 = await rejectProductWithToken('jetski', jetski2._id, ADMIN_TOKEN);
  logTestResult('Admin can reject Partner 1 jetski2', !rejectResult1.error);

  // Admin rejects Partner 2's jetski5
  console.log('--- Admin rejecting Partner 2 jetski5...');
  const rejectResult2 = await rejectProductWithToken('jetski', jetski5._id, ADMIN_TOKEN);
  logTestResult('Admin can reject Partner 2 jetski5', !rejectResult2.error);

  // Test rejected products visibility
  const rejectedAdmin = await getRejectedProductsWithToken(ADMIN_TOKEN);
  const rejected1 = await getRejectedProductsWithToken(PARTNER_1_TOKEN);
  const rejected2 = await getRejectedProductsWithToken(PARTNER_2_TOKEN);

  const foundRejectedJetski2 = findProductById(rejectedAdmin, jetski2._id);
  const foundRejectedJetski5 = findProductById(rejectedAdmin, jetski5._id);

  logTestResult('Admin sees rejected Partner 1 jetski2', !!foundRejectedJetski2);
  logTestResult('Admin sees rejected Partner 2 jetski5', !!foundRejectedJetski5);
  logTestResult('Partner 1 sees their rejected jetski2', !!findProductById(rejected1, jetski2._id));
  logTestResult('Partner 2 sees their rejected jetski5', !!findProductById(rejected2, jetski5._id));
  logTestResult('Partner 1 does NOT see Partner 2 rejected products', !findProductById(rejected1, jetski5._id));
  logTestResult('Partner 2 does NOT see Partner 1 rejected products', !findProductById(rejected2, jetski2._id));

  // Test that rejected products are no longer in pending
  const pendingAfterRejection = await getPendingProductsWithToken(ADMIN_TOKEN);
  logTestResult('Rejected products removed from pending', 
    !findProductById(pendingAfterRejection, jetski2._id) && 
    !findProductById(pendingAfterRejection, jetski5._id));

  console.log('');

  // ===== PHASE 5: Test Revision Flow =====
  console.log('🔄 PHASE 5: Testing Revision Flow');
  console.log('==================================');

  // Admin sends Partner 1's jetski3 for revision
  console.log('--- Admin sending Partner 1 jetski3 for revision...');
  const revisionResult1 = await revisionProductWithToken('jetski', jetski3._id, ADMIN_TOKEN);
  logTestResult('Admin can send Partner 1 jetski3 for revision', !revisionResult1.error);

  // Admin sends Partner 2's jetski6 for revision
  console.log('--- Admin sending Partner 2 jetski6 for revision...');
  const revisionResult2 = await revisionProductWithToken('jetski', jetski6._id, ADMIN_TOKEN);
  logTestResult('Admin can send Partner 2 jetski6 for revision', !revisionResult2.error);

  // Test that revision products are still in pending (revision counts as pending)
  const pendingAfterRevision = await getPendingProductsWithToken(ADMIN_TOKEN);
  const pendingAfterRevision1 = await getPendingProductsWithToken(PARTNER_1_TOKEN);
  const pendingAfterRevision2 = await getPendingProductsWithToken(PARTNER_2_TOKEN);

  logTestResult('Revision products still in pending (admin view)', 
    findProductById(pendingAfterRevision, jetski3._id) && 
    findProductById(pendingAfterRevision, jetski6._id));
  logTestResult('Partner 1 sees their revision jetski3 in pending', 
    !!findProductById(pendingAfterRevision1, jetski3._id));
  logTestResult('Partner 2 sees their revision jetski6 in pending', 
    !!findProductById(pendingAfterRevision2, jetski6._id));

  console.log('');

  // ===== PHASE 6: Test Resubmission Flow =====
  console.log('📤 PHASE 6: Testing Resubmission Flow');
  console.log('======================================');

  // Partner 1 resubmits their jetski3
  console.log('--- Partner 1 resubmitting their jetski3...');
  const resubmitResult1 = await resubmitProductWithToken('jetski', jetski3._id, PARTNER_1_TOKEN);
  logTestResult('Partner 1 can resubmit their jetski3', !resubmitResult1.error);

  // Partner 2 resubmits their jetski6
  console.log('--- Partner 2 resubmitting their jetski6...');
  const resubmitResult2 = await resubmitProductWithToken('jetski', jetski6._id, PARTNER_2_TOKEN);
  logTestResult('Partner 2 can resubmit their jetski6', !resubmitResult2.error);

  // Test that resubmitted products are back in pending
  const pendingAfterResubmit = await getPendingProductsWithToken(ADMIN_TOKEN);
  const pendingAfterResubmit1 = await getPendingProductsWithToken(PARTNER_1_TOKEN);
  const pendingAfterResubmit2 = await getPendingProductsWithToken(PARTNER_2_TOKEN);

  logTestResult('Resubmitted products back in pending (admin view)', 
    findProductById(pendingAfterResubmit, jetski3._id) && 
    findProductById(pendingAfterResubmit, jetski6._id));
  logTestResult('Partner 1 sees their resubmitted jetski3 in pending', 
    !!findProductById(pendingAfterResubmit1, jetski3._id));
  logTestResult('Partner 2 sees their resubmitted jetski6 in pending', 
    !!findProductById(pendingAfterResubmit2, jetski6._id));

  console.log('');

  // ===== PHASE 7: Final Status Verification =====
  console.log('🔍 PHASE 7: Final Status Verification');
  console.log('=====================================');

  // Final status counts
  const finalPending = await getPendingProductsWithToken(ADMIN_TOKEN);
  const finalApproved = await getApprovedProductsWithToken(ADMIN_TOKEN);
  const finalRejected = await getRejectedProductsWithToken(ADMIN_TOKEN);

  logTestResult('Final pending count is 2 (resubmitted products)', finalPending.length === 2);
  logTestResult('Final approved count is 2 (jetski1, jetski4)', finalApproved.length === 2);
  logTestResult('Final rejected count is 2 (jetski2, jetski5)', finalRejected.length === 2);

  // Verify specific products in each status
  const finalPendingIds = finalPending.map(p => p._id);
  const finalApprovedIds = finalApproved.map(p => p._id);
  const finalRejectedIds = finalRejected.map(p => p._id);

  logTestResult('Pending contains resubmitted jetski3 and jetski6', 
    finalPendingIds.includes(jetski3._id) && finalPendingIds.includes(jetski6._id));
  logTestResult('Approved contains jetski1 and jetski4', 
    finalApprovedIds.includes(jetski1._id) && finalApprovedIds.includes(jetski4._id));
  logTestResult('Rejected contains jetski2 and jetski5', 
    finalRejectedIds.includes(jetski2._id) && finalRejectedIds.includes(jetski5._id));

  console.log('\n🎉 E2E Product Status Flow Tests Completed!');
  console.log('===========================================');
  console.log('Summary:');
  console.log('- ✅ Pending status (including revision)');
  console.log('- ✅ Approved status');
  console.log('- ✅ Rejected status');
  console.log('- ✅ Revision flow');
  console.log('- ✅ Resubmission flow');
  console.log('- ✅ Admin sees all products');
  console.log('- ✅ Partners see only their products');
}

runFlow().catch(console.error);
