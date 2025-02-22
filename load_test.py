from locust import HttpUser, task, between

class URLShortenerTest(HttpUser):
    wait_time = between(0.5, 2)  # Random wait between requests

    # The token to be included in cookies
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJoaUBnbWFpbC5jb20iLCJpYXQiOjE3NDAyMDIzMjR9.vZ4JT8z420BV3WUgzj84ZPwDXd55MB0acus4nQaV-yY"

    @task
    def shorten_url(self):
        headers = {"Content-Type": "application/json"}
        cookies = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "url": "https://www.google.com/search?client=firefox-b-d&q=ai"
        }

        # POST request to shorten the URL
        response = self.client.post("/api/shorten", json=payload, headers=headers, cookies=cookies)
        
        # Check if response status is OK (200)
        if response.status_code != 200:
            print(f"Failed to shorten URL: {response.status_code}")
            return

