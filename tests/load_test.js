import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';

// Environment variables for flexibility
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001/api';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJqb2xlbmVAZ21haWwuY29tIiwiaWF0IjoxNzQwMzUyNDA1fQ.2D064eg8fkqGDJev_OfvqMAG_f1fjAOZIKhQ1PcyUPc';  // Replace with a valid token

// Test configuration
export const options = {
    stages: [
        { duration: '5s', target: 10},
        // { duration: '1m', target: 500000 }, // Ramp up to 500,000 users in 1 minute
        // { duration: '3m', target: 500000 }, // Hold at peak for 3 minutes
        { duration: '5s', target: 0 }, // Ramp down to 0 users
    ],
    // thresholds: {
    //     http_req_duration: ['p(99)<100'],  // 99% of requests must finish <100ms
    //     http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
    // }
};

// Generate random URLs
const urls = new SharedArray('urls', function () {
    let data = [];
    for (let i = 0; i < 100000; i++) {
        data.push(`https://example.com/page${Math.floor(Math.random() * 1000000)}`);
    }
    return data;
});

// Test execution
export default function () {
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    
    const payload = JSON.stringify({ url: randomUrl });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // set cookies
    const jar = http.cookieJar();
    jar.set('http://localhost:3001', 'token', JWT_TOKEN);

    const res = http.post(`${BASE_URL}/shorten`, payload, params);

    // Check conditions
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 100ms': (r) => r.timings.duration < 100,
    });

    sleep(1);
}