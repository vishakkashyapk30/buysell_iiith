import xml2js from 'xml2js';
import { CAS_CONFIG } from '../config/cas.config.js';

export const validateCASTicket = async (ticket) => {
    try {
        const response = await fetch(
            `${CAS_CONFIG.CAS_URL}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(CAS_CONFIG.SERVICE_URL)}`
        );
        const xmlResponse = await response.text();
        
        return new Promise((resolve, reject) => {
            xml2js.parseString(xmlResponse, (err, result) => {
                if (err) return reject(err);
                
                const serviceResponse = result['cas:serviceResponse'];
                if (serviceResponse['cas:authenticationSuccess']) {
                    const userInfo = serviceResponse['cas:authenticationSuccess'][0];
                    const email = userInfo['cas:user'][0];
                    const fullName = email.split('@')[0];
                    const [firstName, lastName] = fullName.split('.');
                    
                    resolve({
                        email,
                        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
                        lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : ''
                    });
                } else {
                    reject(new Error('CAS Authentication failed'));
                }
            });
        });
    } catch (error) {
        throw new Error('CAS Validation failed');
    }
};