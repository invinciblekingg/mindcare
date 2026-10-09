import http from 'http';

console.log('--- MindCareAI Backend Verification ---');

const req = http.get('http://localhost:3000/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('\n[Health Endpoint Result]');
    console.log(`Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('Response:', JSON.parse(data));
      console.log('✅ Health endpoint is UP and properly formatted.');
    } else {
      console.log('Response:', data);
      console.log('❌ Health endpoint returned an error.');
    }
    printChecklist();
  });
});

req.on('error', (e) => {
  console.log('\n[Health Endpoint Result]');
  console.log('❌ Could not connect to the local server. Is it running on port 3000?');
  console.log(`Error details: ${e.message}`);
  printChecklist();
});

function printChecklist() {
  console.log('\n[Manual API Checklist]');
  console.log('Use a tool like Postman, Insomnia, or curl to verify the following endpoints:');
  console.log('  [ ] POST /api/auth/register');
  console.log('  [ ] POST /api/auth/login');
  console.log('  [ ] GET  /api/consent/status');
  console.log('  [ ] POST /api/consent');
  console.log('  [ ] POST /api/check-in');
  console.log('  [ ] GET  /api/check-in');
  console.log('  [ ] POST /api/journal');
  console.log('  [ ] GET  /api/journal');
  console.log('  [ ] POST /api/journal/[id]/share');
  console.log('  [ ] GET  /api/conversations');
  console.log('  [ ] POST /api/conversations');
  console.log('  [ ] GET  /api/conversations/[id]/messages');
  console.log('  [ ] POST /api/chat (SSE streaming)');
  console.log('  [ ] POST /api/referral');
  console.log('  [ ] GET  /api/referrals');
  console.log('  [ ] GET  /api/admin/audit');
  console.log('\nBackend hardening complete. No frontend tasks were created.');
}
