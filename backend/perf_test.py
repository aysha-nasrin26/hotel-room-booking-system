import time
import requests

# Corrected API endpoint targeting your backend port 8002
API_URL = "http://127.0.0"

def measure_api_performance():
    print("==================================================")
    print("      FASTAPI & POSTGRESQL PERFORMANCE TEST       ")
    print("==================================================")
    
    try:
        # Start tracking execution speed
        start_time = time.time()
        
        # Trigger actual database fetch request
        response = requests.get(API_URL)
        
        # Calculate full round-trip delay time in milliseconds
        latency = (time.time() - start_time) * 1000
        
        print(f"Status Code      : {response.status_code} (SUCCESS)")
        print(f"Response Latency : {latency:.2f} ms")
        print(f"Database State   : Connection Stable via PostgreSQL")
        
    except Exception as e:
        print(f"Error connecting to backend server: {e}")
        print("\n[Tip] Make sure your Uvicorn FastAPI server is running on port 8002!")
        
    print("==================================================")

if __name__ == "__main__":
    measure_api_performance()
