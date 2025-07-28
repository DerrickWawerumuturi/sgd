FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean

WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install --production

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the backend
COPY . .

# Expose ports
EXPOSE 4000 5000

# Run both servers (Node and Python) together
CMD sh -c "python3 main.py & npm start"
