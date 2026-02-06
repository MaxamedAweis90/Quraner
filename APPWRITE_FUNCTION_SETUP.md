# Appwrite Function Setup

This project expects an Appwrite Function with ID `createPlan`.
This guide explains what to create in Appwrite, which env vars to set, and how they map to the app's `.env`.

## 1) Create the Function
1. Open Appwrite Console.
2. Go to Functions.
3. Click Create Function.
4. Name: createPlan
5. Function ID: createPlan
6. Runtime: Node.js 18 (or latest supported)
7. Permissions:
   - Execute: Any authenticated user (role:users)
   - Read/Write for function storage as needed

Notes:
- Execute permissions must include authenticated users or the app cannot call the function.
- Storage permissions are not required unless you store files inside the function.

## 2) Add Environment Variables (Function)
In the Function settings, add these variables so the function can write to the database:

- APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
- APPWRITE_PROJECT_ID=6985ff6300206c0836c0
- APPWRITE_API_KEY=YOUR_SERVER_API_KEY
- APPWRITE_DATABASE_ID=quraner_db
- APPWRITE_COLLECTION_USERS=users
- APPWRITE_COLLECTION_PLANS=plans
- APPWRITE_COLLECTION_PLAN_DAYS=plan_days
- APPWRITE_COLLECTION_PLAN_SESSIONS=plan_sessions
- APPWRITE_COLLECTION_STREAKS=streaks

Notes:
- Use a server API key with database write permissions.
- Keep this API key secret (never store in the app or .env).
- APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID must match your Console project.
- Collection IDs must match the ones you created (same as schema names).

## 3) Deploy Function Code
Use the function code we will provide in the next step. After deployment:
1. Save.
2. Build.
3. Deploy.

## 4) Verify App .env (Mobile)
Your app already uses this entry in `.env`:

- EXPO_PUBLIC_APPWRITE_FUNCTION_CREATE_PLAN=createPlan

This is the function ID the app will call. If your function ID is different, update this value.

Also confirm these entries exist in `.env` and match your Appwrite IDs:

- EXPO_PUBLIC_APPWRITE_DATABASE_ID=quraner_db
- EXPO_PUBLIC_APPWRITE_COLLECTION_USERS=users
- EXPO_PUBLIC_APPWRITE_COLLECTION_PLANS=plans
- EXPO_PUBLIC_APPWRITE_COLLECTION_PLAN_DAYS=plan_days
- EXPO_PUBLIC_APPWRITE_COLLECTION_PLAN_SESSIONS=plan_sessions
- EXPO_PUBLIC_APPWRITE_COLLECTION_STREAKS=streaks

## 5) Test
1. Run the app.
2. Complete the wizard.
3. Confirm the function runs and creates plan documents in `plans`, `plan_days`, and `plan_sessions`.
