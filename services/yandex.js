const getOAuthToken = async () => {
    try {
        const response = await fetch('https://oauth.yandex.ru/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: 'x2iftegsxrhp7x5f',
                client_id: process.env.METRICA_CLIENT_ID,
                client_secret: process.env.METRICA_CLIENT_SECRET,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            console.log(data.access_token)
            return data.access_token;
        } else {
            console.error('Ошибка при получении токена:', data);
            return null;
        }
    } catch (e) {
        console.error('Ошибка при запросе токена:', e);
        return null;
    }
};

module.exports = { getOAuthToken };