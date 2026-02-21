import http.server
import socketserver
import os
import webbrowser

PORT = 8080
DIRECTORY = "web"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if not os.path.exists(DIRECTORY):
        print(f"Error: {DIRECTORY} directory not found.")
        return

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Agri365 Premium Web Hub running at http://localhost:{PORT}")
        print("🌍 Powered by Online Free API Interfaces")
        print("Press Ctrl+C to stop the server")
        
        # Open in browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
