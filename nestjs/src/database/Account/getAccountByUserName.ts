import { BadGatewayException, InternalServerErrorException } from '@nestjs/common'

import { collection_account } from '../firebase/firebase_config'

const getAccountByUsername = async (email: string) => {
    try {
        const result = await collection_account.where('email', '==', email).get()
        if (result.docs.length > 0) {
            console.log('true')
            return result.docs
        } else {
            throw new InternalServerErrorException()
        }
    } catch (error) {
        throw new BadGatewayException()
    }
}




export default getAccountByUsername