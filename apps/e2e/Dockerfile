FROM cypress/included:cypress-12.6.0-node-16.18.1-chrome-110.0.5481.96-1-ff-109.0-edge-110.0.1587.41-1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

ENV BASE_URL $BASE_URL
ENV CASE_TEAM_EMAIL $CASE_TEAM_EMAIL
ENV CASE_ADMIN_EMAIL $CASE_ADMIN_EMAIL
ENV INSPECTOR_EMAIL $INSPECTOR_EMAIL
ENV USER_PASSWORD $USER_PASSWORD
ENV APP $APP

# Set the entry point command
CMD ["npm", "run", "cy:ci"]

VOLUME /app/cypress/screenshots/

