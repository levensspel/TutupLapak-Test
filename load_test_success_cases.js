import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import {
  generateRandomEmail,
} from "./src/helper/generator.js";

export const options = {
  stages: [
    { duration: '10s', target: 50, },
    { duration: '30s', target: 200, },
    { duration: '1m', target: 800, },
    { duration: '1m', target: 1500, },
    { duration: '30s', target: 3000, },
    { duration: '30s', target: 6000, },
    { duration: '1m', target: 6000, }
  ],
};

const BASE_URL = 'http://localhost:8080/v1';
const TEST_PASSWORD = 'asdfasdf';

const userIds = [
  '17e094f8-41cd-4df6-8a09-f4bd13029ac6' , '38d6013d-e1ef-4063-9dd7-e9ae4a9ff1a0', '076e8c95-47bd-4555-9935-87385ee7b0f2', "0000178e-9ec9-42d9-ac00-a88b3d682417", "0000bdb6-ff04-4466-9b3d-62f9fe74ce2a", "0000fe09-eb1a-4996-8ea8-39fc63305d24", "00010b65-7b6d-43da-a2a4-0a7c4fed31f1", "00020cd0-fc8d-4699-a8bd-cfb46a3685f0", "00023252-aae4-444a-a9d0-b154f4ea63ee", "000258cb-785e-4f27-815c-f1a454ff44c7", "00026771-75c6-438d-bcbf-718d5d89a429", "00028b37-9797-4c8b-b1d0-a481df078f13", "0003b8bf-e60e-4a88-943f-1e8e950d1e52", "0003be01-cafa-4ed4-960b-6f3f44e62fec", "0003be4c-6b1e-4e50-a86a-2b26a839113d", "0003faac-9feb-417a-954f-d3c9f61556ce", "00044646-69b5-4887-bf72-67fe2106c563", "00052896-9d5f-4498-9b1f-7be98ed81303", "000603ff-60e1-493a-b915-e68cc3382cc2", "00061160-1f9f-4ebe-ad54-d4e0cacd9175", "0006120b-8016-40ad-9edf-1fbc4a9d8859", "000622da-b110-48bb-95c1-78c58c5a7a6d", "00062e47-0e45-467a-8173-33a44e9816b1", "00069f7b-c73a-4009-9350-fc093b95634d", "0008dcde-187e-4794-99a0-69a70d64629a", "00090ce3-ce7e-4394-8074-cea0ce273126", "00099580-8e0b-461a-b2bf-10e99884dca1", "0009fa8a-0feb-4d5a-ad8c-784fcfcc61c5", "000a7ab3-00b3-4657-83bc-c435a87b0687", "000ab142-1d61-4485-96b4-d756fcfa047d", "000b0c97-c395-4c7e-b27c-c5a09c27a597", "000b4baa-e042-4712-82cc-f511ac2b857c", 
  "000b7a17-c13f-448f-adc3-594f33f76b78", "000b9a2f-bac9-4ccf-82b4-3e46c137fc6e", "000c1617-19a2-4d09-a894-c81085216775", "000c1a00-ba37-47eb-8ea2-e4f6db46342c", "000c7207-1149-4d5b-8f48-726b97e95731", "000cca79-a1d5-475c-bf9a-1a66b124d4e2", "000d58bf-a226-4e6c-9ab3-af53db0f4d3f", "000d6340-bee1-4407-aba1-0ea346c77df9", "000ea95c-b9b6-4eed-bc64-f48f56943d06", "000ed639-6b98-488f-b0a0-f1fd931a0612", "000ededb-bce3-45c6-bf18-3c28ffe44dbe", "000f2cc0-3382-4a00-bb9b-8a51491c2334", "00103186-9caa-4fe7-a4a6-f09655f219b1", "001037b7-d29b-437d-aa24-5cce836b1cae", "0010c861-3492-486e-9291-f84e063cb414", "0010d21a-bffd-4c20-9af6-d64e45a06b95", "0010eef5-a6dc-4478-9253-e8e120384d56", "00110fff-8808-4894-a158-cfe7ca617345", "00111360-3932-4384-974f-1ffb86f04451", "00118c76-b104-497a-8f18-caadcadef935", "0011e640-1f8b-4d0f-a5ff-9f7453a16851", "00123c5c-34b2-4e76-b140-0f94ee98078b",
  "001370ee-755a-4e20-b022-7337c20ed021", "00144afb-c11f-42c0-b006-0f2be908db31", "001475ce-305c-4a3e-a568-25807f5d3aa3", "0014a868-a837-41e7-b8e7-f9d905833f8b", "0014c341-b329-46b5-addc-4a78b8b21d74", "001643e8-5a10-4d8b-9a67-856cc2b0e830", "0016636c-78d7-48b3-a0e9-df53f62bf089", "0016bd2a-a439-4a48-add0-e7679e288800", "001743ad-d76d-4cc6-b935-ff8816c0f573", "00174feb-a694-4d2e-a4e5-ed3abf0d6480", "0017517f-38a7-4da0-aadb-e8121b36d3f3", "0017cf97-04fa-4d72-aa86-dff6e08c94d5", "00188e0f-4210-4e1b-bc4d-928ecfb76832", "00193351-8f27-4dd5-a86f-699cf9286ae5", "001993b7-32f6-4814-882e-191c72daa5d7", "0019c1eb-3746-43af-9e2d-868c099620c8", "001a17b6-1d0d-4662-a2d1-15f18edf57d2", "001a8a90-6f4a-46d5-b2d5-70e00a5f508b", "001a9fbf-ff60-4c48-bac1-959888b6e7c4", "001aa53f-ff9b-4d6a-af31-4caf7df2f247", "001ae3b6-13ae-4c0e-996c-335f2c1c37c8", "001b4f61-2665-4f35-b2a1-dcf4622a6334", "001b9023-75c5-4962-af41-a0042a540f52", "001c438a-2b15-4532-a067-390570ad3c71", "001cb530-9458-4130-8af2-76947669263d", "001cffb7-d61b-41c6-9a62-4c0cd41e7e68", "001d141c-f23c-435d-b4da-c4581ce5e24d", "001d5d13-a600-4549-a693-7f3e559a03bc",
  "001d8937-e8e8-466e-b6e9-6952cdfb394b", "001dacfc-d065-4638-9ac8-7d44b4fc8a4d", "001dc528-d8f4-495f-a0ba-ad2970c3d545", "001ef6e3-8e3f-441e-b65e-964ec59fa945", "001f949f-0b4d-466e-8644-7a511d9d2d5e", "001ff984-4745-46d2-825a-88ddf36ad9e1", "0020758e-d0ce-4418-8a9c-5d61fe30886b", "0020e319-c6aa-4b3e-8b32-b85a8188257c", "0020fbc1-91e6-434f-90fd-a11ad5a68197", "00212c24-5022-449b-a10d-f2cb9527cde5", "0021a169-9ee0-4268-b0ba-808674409d7f", "ffffadf7-980c-44a0-8122-7821a1195343", "fffdbe40-ba45-49a0-9405-c2162d782634", "fffd2bfb-1760-4dd7-86e8-2520ae086154", "fffcf709-2b7d-4601-8438-c6361f2d2c94", "fffc918e-9f22-489f-8a8d-09d2cb251f61", "fffc5447-22a7-4c6a-a1aa-dde499b33522", "fffc1b40-6ba2-4845-a61c-4c138ced9dbc", "fffba64b-4440-4b02-b424-bf16f7059e6c", "fffb43d1-4f58-4b1d-9778-7f2deff7cfc1",
  "fffabb52-25c7-4ee1-ba79-a7597fea3620", "fffab507-ef40-4677-ac4d-1439bfe3a983", "fff8ca71-4017-44f1-bb8c-d89a04b44df6", "fff829fe-b367-4857-88fe-cb69ad70aeb2", "fff7325a-27ed-464f-98f0-c68696f93ebf", "fff6d6a6-3f33-494c-897b-237caf5bc7b8", "fff6aafb-9c37-4a31-b9a8-65b3c9c08184", "fff6a9f8-a381-4986-850c-56e370317bd3", "fff51517-12d8-4536-af2f-4aca28a91925", "fff3cecc-5fd9-44c7-aa68-603e5e319f16", "fff392f1-44c4-44b9-a62f-fcb2f5b4b9b6", "fff348e4-edf4-4b7c-9ecb-4778d3b40389", "fff2b89b-b453-4914-8759-8583dcf63c4d", "fff196f0-79f6-41fe-856a-796ccd4dd481", "fff153fd-8366-4919-9a2c-d6b0d6eac967", "fff0fae0-4eed-4216-b6c3-efce8878174b", "fff0c9e7-2c1c-43d1-85b3-92d2396c6bd4", "fff09a7c-111a-4eeb-bc50-c118ae622e9f", "fff08d52-5b64-4a5d-8363-72da96e00140", "fff087cf-0c42-4938-b11a-f9abef7b7675",
  "fff06c98-c872-4753-ac49-9cd0c7fe4790", "ffe091ed-ea0c-44e7-b8ff-5863d0b2499f", "ffdfaedc-8018-41f9-8704-e99c8650ea38", "ffded354-8691-4991-ac02-46c71d4ed462", "ffde7ce2-ccbf-4d83-94d1-923c204bbba5", "ffde2835-72dc-4062-a6b1-36c125698f25", "ffdce2ed-88aa-4059-9100-adcfcd9fe48d", "ffdc481e-48fd-4933-9a6e-e43cb8fc55b0", "ffdc1873-b9cb-4533-9807-bfd58ec6344e", "ffdba641-7599-46a2-80e2-d4a9ce9c4c76", "ffdb52d9-e519-40e5-97dc-4f1181a41f76", "ffdaf24b-3474-402a-83c1-b396f8f04731", "ffd87f00-15ce-4aab-a8d4-03409dfbfd5b", "ffd85ca9-1164-4b23-9e84-b57ad5a16f92", "ffd8245d-3b1c-432b-a234-8827098f7dd5", "ffd75fb5-12dc-47bb-94f5-094b74cada62", "ffd70b0a-6b9c-4039-92ac-3f5f7fc044d9", "ffd69ccd-469d-4b34-bcec-2d9eadeb613b",
  "ffd6347a-cb96-43fb-90f7-cebefeb02b5c", "ffd61142-b8e8-40d0-9c50-c4730a7d1cf2", "ffd55d35-d0bb-480b-be36-8a92d18d8667", "ffd4e272-e97f-43c8-9d8e-bf8069b85831", "ffd3afcc-2c44-4f65-8131-3ef2f0f52daa", "ffd36d62-60a7-4aba-ba7b-ce561cfc26b8", "ffd304c2-f1a3-4048-99fd-0d28997126e3", "ffd2dc82-5d29-4c76-8fee-69c766876973", "ffd2a83e-dec8-4cae-b999-3a4c5bec987b", "ffd1cbd4-0d81-447d-a9b5-d8207f575207", "ffd182e0-b73e-4c1e-aa1f-5c232cbc9a3b", "ffcefdab-eb3d-4356-a793-3540f5864781", "ffce9548-7a15-4918-8874-bd0cfa5b16d8", "ffce8aa8-0d38-4891-83d6-5c2124b71d6d", "ffcd9c0a-3d14-4e16-844c-8671bc055f60", "ffcd2014-0cf9-438c-b36d-e5e6c7f16de0", "ffccef47-8bb4-466f-85e1-a922ae31298c", "ffcbfc9e-656a-48e2-9f71-9f7c80340510", "ffcbe220-cd17-4483-8e0a-eeb483b0fbf6", "ffcafab6-37c1-4f2a-a41a-e227dde790cd", "ffca73a9-fdef-49b8-81b0-76d3fd8985f6", "ffc9915e-3e81-4918-87a6-45d1fbd7ba9f", "ffc9450c-dab5-4370-9e32-431a1c2e9979", "ffc8ff67-5563-4d78-9d28-0c0024da659d", "ffc8d293-c299-469d-8bad-6fa5d4324139", "ffc8c5d5-e757-47a5-b596-191a1923df48", "ffc8a9b3-df49-41d2-91b1-68d7daa5f8a8", "ffc87992-b0fc-4069-8134-6d60ecd4a156", "ffc8489e-cd08-4c74-86a6-12d203c89412", "ffc82051-d136-4528-8ae9-a607d56bb49c", "ffc7db8c-9c65-4da4-b636-1597b8f59b3f", "ffc7c7df-6ab3-4ea1-a9ba-54cc01d45830", "ffc79181-074d-4b5e-9cb3-b4776056979b", "ffc6c4ba-b719-4a08-bf25-aa2bae2b1487", "ffc6b0f3-4842-4a4b-bb29-a9ab18d9321b", "ffc62aa4-e094-427d-a837-1a25e87cddc4", "ffc5abc9-e255-4e63-b917-5099ee77069c", "ffc56605-cf0f-41cc-bae6-1000d21bd324", "ffc43117-b1b4-4008-8c02-fd2f8fd414ad", "ffc3715f-137f-4616-8dfc-6e330f8b8bda",
  "ffc3674f-421d-49b3-8091-ac56c957fa3b", "ffc3535f-6b2d-45ac-95fd-8faaee1e9413",
  "ffc32627-67a9-45a0-9211-25a5a2322fd3",
  ]

// Helper function to parse response JSON safely
async function parseJSON(response) {
  try {
    return await JSON.parse(response.body);
  } catch (e) {
    console.error(`Failed to parse JSON. Response body: ${response.body}`);
    return null;
  }
}

export default async function () {
  const TEST_EMAIL = generateRandomEmail(); // Generate a unique email for each virtual user

  // Test Register Endpoint
  const registerPayload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  const registerHeaders = {
    'Content-Type': 'application/json',
  };

  const registerResponse = http.post(`${BASE_URL}/register/email`, registerPayload, {
    headers: registerHeaders,
  });

  const registerData = await parseJSON(registerResponse);

  // Check register response
  check(registerResponse, {
    'register status is 201': (res) => res.status === 201,
    'register response is valid JSON': () => registerData !== null,
    'register response has email': () => registerData?.email === TEST_EMAIL,
    'register response has token': () => registerData?.token && registerData.token !== '',
  }) || fail('Registration test failed');

  // Simulate a pause before login
  sleep(1);

  // Test Login Endpoint
  const loginPayload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  const loginResponse = http.post(`${BASE_URL}/login/email`, loginPayload, {
    headers: registerHeaders,
  });

  const loginData = await parseJSON(loginResponse);

  // Check login response
  check(loginResponse, {
    'login status is 200': (res) => res.status === 200,
    'login response is valid JSON': () => loginData !== null,
    'login response has email': () => loginData?.email === TEST_EMAIL,
    'login response has token': () => loginData?.token && loginData.token !== '',
  }) || fail('Login test failed');

  // Add delay to simulate user behavior
  sleep(1);

  const token = await loginResponse.json('token');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Send GET request to /user
  const response = http.get(`${BASE_URL}/user`, { headers });

  // Validate response status
  check(response, {
    'Status is 200': (res) => res.status === 200,
  });

  // Validate response structure and fields
  if (response.status === 200) {
    const body = response.json();
    check(body, {
      'Response has email field': (b) => 'email' in b,
      'Response has phone field': (b) => 'phone' in b,
      'Response has fileId field': (b) => 'fileId' in b,
      'Response has fileUri field': (b) => 'fileUri' in b,
      'Response has fileThumbnailUri field': (b) => 'fileThumbnailUri' in b,
      'Response has bankAccountName field': (b) => 'bankAccountName' in b,
      'Response has bankAccountHolder field': (b) => 'bankAccountHolder' in b,
      'Response has bankAccountNumber field': (b) => 'bankAccountNumber' in b,
    });
  }
  
  sleep(1);

  const selectedIds = userIds
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)

  const query = selectedIds.join(',');

  // Send GET request to /user
  const getManyUserProfilesResponse = http.get(`${BASE_URL}/user/many?userIds=${query}`, { headers });

  // Validate getManyUserProfilesResponse status
  check(getManyUserProfilesResponse, {
    'Status is 200': (res) => res.status === 200,
  });

  // Validate getManyUserProfilesResponse structure and fields
  if (getManyUserProfilesResponse.status === 200) {
    const body = getManyUserProfilesResponse.json();
    check(body, {
      'ManyUserProfilesResponse has correct length': () => body.length == selectedIds.length,
    });
  }
  
  sleep(1);
}
