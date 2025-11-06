import axios from 'axios';

const gamesApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/game/games/'
})

export const getGames = () => gamesApi.get()