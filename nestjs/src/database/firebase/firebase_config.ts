import { collection } from 'firebase/firestore';
import admin from 'firebase-admin'




const serviceAccount = {
  "type": "service_account",
  "project_id": "react-auth-e2d95",
  "private_key_id": "3889d4467a4e8ca29585398bacbb9e983a0f171d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDoAccTBoxdCY3V\nNZ0fTeMeKKwjz0OQOcmC8WLTczshOXGykU2bP1rYFD1SDVSIU6vU45wMbayEoLbl\n4uBJUajjkoe2AYfWsZVunAu/cu9tdFj8hNKmGXgADbPqy2Bf1R7U+Wa8h2azroQS\n7VuexjXFcz6JBuqF/O3SDO7tltSe2QDkzJNZazjPQEhHXLZVKr9IAXwSMaKj3j0n\nIiMh65wD5NkUDRJZ5qrclXQHC4NzrpLRqTJ6ANcENZoNUPnXbArOIPaBsd4tkKru\ngeYFWsyWGe6+3dh+xhuPM4fHR4hjdf9FdQPl8d0C61v8yCEAss2oMfvX5USFanrc\nKQfMSUgvAgMBAAECggEAAiRKDy3nS9CTw50cFzbj2tprRGVcbU9rQc8yp1sP962N\nFCXtPnqmPwpoyoIe/qcvFecIAMFeb1cAeTzP7z1WvssSf6ah92RqSbwdC6Zm+W6y\nh5o+S5Q+nFmECK3Z9OiFwVeQEDt7wjrhMz+Hsf6Ibosyz5cFwTjlhSPjbMQQsGqx\n7EJ3OWtd+Gj6P6q7iwf/GbVKoAcadbLrRCkaHjjEmS0GYaVcbh9WrWUMFTc6oEMS\nchv85KJkSWRWVEWqjCSE2t/rpxkjRqLtS4ZNg62frfHKwMyYf0juahuBvxg5O5t/\nNc3YmMqsXnbok42GV5hjb+nc1RUyRPPAALOLbrWG0QKBgQD44vmedhTB64tFOhzH\ncT40dJFF44d7mCCJK9Msdvy6pBoHg6Uysl1MGra12WJ9JAyqMgRytmBgXmfwoGpo\n5vCvp/e6pKHvQh35D6pM/UGqj/+ctIlvx89eYX7FZoU7T/IrV+KuMXe2yXltCYqs\nPIi3K5vJkCaJk+LRCuzdssRz2QKBgQDuo0ydxQtnU9yCJPQaJo1Hq+ugrbjBk2iq\no5ACYO6IidezPLufjj77bqDDJRDC0u8LPo+XTXM4iZyyDbIsUBVhVGDdfsphQ2Ab\nCpiIiYVONpCBLpJ8Os1l/sVS1mecRmf6TnJt+i5W08Ye/jLsCoUMoG1CYfe0iJU5\nEirCUqj/RwKBgE+YTxpFSyglSxntlsyVw74E1XzTYj29jhIwSM28k+CgoI5spIVN\nE5dGJ86KYfwBbmdzrYZ+Gt5W8si6lK1NxgV3Izu2cO9SZsGDKASNLdX9TVLxTc7I\nyOG3LlK1EcDBNYJ1DdKFkXKMhl+/oHCqv1JNCPpyNlDjUbNm2g+gn0EpAoGBANfD\ncEeJ3FitW0eUj9yBFOZDjET4LX9gf5chUdjEuYdcUlmtxNprq4h8KwCmJ7RvMVES\nXJPppA7vZW0bswgb1Gju+LHrrKIqX9+zQdzZslzYOumCKVIHfKUGqHTQhFeo1ORd\nP1sug+1fhteI8JO4ozmaZ49IssVZZMp4IY8XW9OLAoGBAIp8sDGtX2YIZgwsH7Ov\n90m6JqgQrXzkQdHKitqFVkJ/Er25tMPQyuBz2NWmc5CLynCEotRRMF9kN5Y2n3QP\n9+TyFncFYBrRKoO4xOj8ElxcNTHZs6Qj6RgLlgouSk+ZjlpXN0Mx2Edob34DxEgj\n4JjSz50f/nop+uwKPkSOitD5\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-dfc6x@react-auth-e2d95.iam.gserviceaccount.com",
  "client_id": "109336000467065351275",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dfc6x%40react-auth-e2d95.iam.gserviceaccount.com"
} as admin.ServiceAccount




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth()
export const db = admin.firestore()
export const storage = admin.storage()
export const collection_course = admin.firestore().collection('Course')
export const collection_account = admin.firestore().collection('Account')
export const collection_category = admin.firestore().collection('Category')
export const collection_favorite = admin.firestore().collection('Favorite')
export const collection_verifyemail = admin.firestore().collection('VerifyEmail')
export const collection_score = admin.firestore().collection('Score')
export const collection_banner = admin.firestore().collection('Banner')
// export const collection_certificate = admin.firestore().collection('Certificate')