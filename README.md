## Setting Up Environment Variables

To configure the project correctly, follow these steps:

1. **Create an environment file**  
   In the root directory of your project, create a file named **`.env.development`**.

2. **Add the following variables**  
   Copy and paste the following environment variables into your `.env.development` file:

   ```ini
   # Server-side variables
   APIBASE="https://dummyjson.com/"
   APP_ENV="development"
   BASEURL="http://localhost:3000/"

   # Client-side variables
   NEXT_PUBLIC_APIBASE="https://dummyjson.com/"
   NEXT_PUBLIC_APP_ENV="development"
   NEXT_PUBLIC_BASEURL="http://localhost:3000/"

3. **Installing Dependencies**
	yarn install
	# or
	npm install

4. **Starting the Development Server**
	yarn start:dev
	# or
	npm run start:dev

5. **Application should now be available at: 🔗 http://localhost:3000 🚀**
