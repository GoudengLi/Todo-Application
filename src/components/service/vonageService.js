
const sendSMS = async (from, to, text) => {
    const apiKey = '5d052763';
    const apiSecret = "6HwYiieaP7P7VmyW";
    
    const response = await fetch('https://rest.nexmo.com/sms/json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(apiKey + ':' + apiSecret)
        },
        body: JSON.stringify({
            from: from,
            to: to,
            text: text
        })
    });

    const data = await response.json();
    return data;
};

export { sendSMS };