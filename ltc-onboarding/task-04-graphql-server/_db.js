let games = [
    {
        id: 1,
        title: 'The Witcher 3: Wild Hunt',
        platform: ['PC', 'PS4', 'Xbox One'],
    },
    {
        id: 2,
        title: 'The Witcher 2: Assassins of Kings',
        platform: ['PC', 'PS3', 'Xbox 360'],
    },
    {
        id: 3,
        title: 'The Witcher 1: The Game of the Year Edition',
        platform: ['PC', 'PS3', 'Xbox 360'],
    },
];
let reviews = [
    {
        id: 1,
        rating: 5,
        content: 'This is a great game!',
        game: { id: 1 },
        author: { id: 1 },
    },
    {
        id: 2,
        rating: 4,
        content: 'This is a good game!',
        game: { id: 2 },
        author: { id: 2 },
    },
    {
        id: 3,
        rating: 3,
        content: 'This is a bad game!',
        game: { id: 3 },
        author: { id: 3 },
    },
];
let authors = [
    {
        id: 1,
        name: 'John Doe',
        verified: true,
    },
    {
        id: 2,
        name: 'Jane Doe',
        verified: false,
    },
    {
        id: 3,
        name: 'Jim Doe',
        verified: false,
    },
];

export default {
    games,
    reviews,
    authors,
};
