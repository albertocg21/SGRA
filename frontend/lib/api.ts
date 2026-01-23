const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(
    endpoint: string,
    options: RequestInit = {}
) {
    const url = `${API_URL}${endpoint}`;

    const token = typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
}

export async function getReservas() {
    return fetchAPI('/reservas');
}

export async function createReserva(data: any) {
    return fetchAPI('/reservas', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
