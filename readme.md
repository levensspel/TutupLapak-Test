# TutupLapak Test Cases!
## ProjectSprint Batch 3 Project 3

### Status
- ✅ Register Email
- ✅ Login Email
- ✅ Get Single User Profile
- ✅ Get Many User Profiles (Success-Case Load Testing)

### Prerequisites
- [ k6 ](https://k6.io/docs/get-started/installation/)

### How to start
- Navigate to the folder where this is extracted / clone in terminal
- run
    ```bash
    BASE_URL=http://localhost:8080 make pull-test
    ```
    ⚠️ Adjust the `BASE_URL` value to your backend path
### How to load test (Success & Failed Cases)
- run
    ```bash
    BASE_URL=http://localhost:8080 k6 run load_test.js
    ```
    ⚠️ Adjust the `BASE_URL` value to your backend path
### How to load test (Only Success Cases - to see max throughput)
- run
    ```bash
    BASE_URL=http://localhost:8080 k6 run load_test_success_cases.js
    ```
    ⚠️ Adjust the `BASE_URL` value to your backend path
### Cookbook 🍳
- How can I know what's the payload that k6 give and what it receives? Run in debug mode:
    ```bash
        DEBUG=true BASE_URL=http://localhost:8080 make pull-test &> output.txt
    ```
    For easier searching, you can run this to record the output to `output.txt` for easier searching
    ```bash
        DEBUG=true BASE_URL=http://localhost:8080 make pull-test-out
    ```

### Environment Variables
- `BASE_URL` (string,url) sets the base url of the backend
- `DEBUG` (boolean) show what was sent to the backend, and what is the response
