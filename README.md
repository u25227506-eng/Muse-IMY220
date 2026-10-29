# Muse-IMY220

This is an IMY220 Project for 2026: Photo Sharing Website. 

My website is Muse. Very chic and elegant and is used to share photos, build albums, add friends, comment, report and search. 

------------------------------------------------------------
Deliverable 3

GitHub

guthub repo: http://github.com/u25227506-eng/Muse-IMY220

MongoDB connection String: 
mongodb+srv://u25227506_db_user:XH9cWs59ylXX4kfa@cluster0.wjgvv1o.mongodb.net/?appName=Cluster0

--------------------------------------------------------
how to run with Docker: 

BACKEND
1. cd backend
2. build docker image: docker build -t muse-backend .
3. run the container: docker run -p 5000:5000 muse-backend


FRONTEND
1. cd frontend
2. build docker image: docker build -t muse-frontend .
3. run the container: docker run -p 5173:5173 muse-frontend

open browser and go to: http://localhost:5173

-------------------------------------------------------------
Test accounts
user: test@test.com  | password: test1234
admin: admin@muse.com   | password: admin1234
